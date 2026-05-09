from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2  
import os   

app = Flask(__name__)

# 1. تحميل الموديل
MODEL_PATH = "model/brain_tumor_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

classes = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']

# --- دالة توليد الـ Heatmap (Grad-CAM) ---
def generate_gradcam(img_array, model, last_conv_layer_name):
    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        class_channel = preds[:, np.argmax(preds[0])]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)
    return heatmap.numpy()

# --- دالة دمج الـ Heatmap مع الصورة الأصلية وحفظها ---
def save_heatmap(image_path, heatmap, output_path):
    img = cv2.imread(image_path)
    if img is None:
        return False
    
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    
    superimposed_img = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)
    cv2.imwrite(output_path, superimposed_img)
    return True

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'path' not in data:
            return jsonify({"status": "error", "message": "No path provided"})

        image_relative_path = data['path']
        full_path = os.path.abspath(os.path.join('../backend', image_relative_path))

        if not os.path.exists(full_path):
            return jsonify({"status": "error", "message": f"File not found at {full_path}"})

        # معالجة الصورة للتوقع
        img = cv2.imread(full_path)
        img_res = cv2.resize(img, (224, 224))
        img_array = img_res.reshape(1, 224, 224, 3) / 255.0
        
        # 1. التوقع
        prediction = model.predict(img_array)
        class_index = np.argmax(prediction[0])
        result = classes[class_index]
        confidence = float(np.max(prediction[0])) * 100

        # 2. توليد الـ Heatmap (فقط لو فيه ورم)
        heatmap_url = None
        if result != "No Tumor":
            # "Conv_1" هو اسم آخر طبقة Convolutional في MobileNetV2
            try:
                heatmap = generate_gradcam(img_array, model, "Conv_1")
                heatmap_name = "heatmap_" + os.path.basename(full_path)
                # حفظها في فولدر الـ uploads بتاع الباك إند
                output_path = os.path.join('../backend/uploads', heatmap_name)
                
                if save_heatmap(full_path, heatmap, output_path):
                    heatmap_url = f"uploads/{heatmap_name}"
            except Exception as cam_e:
                print(f"Grad-CAM Error: {cam_e}")

        return jsonify({
            "result": result,
            "confidence": f"{confidence:.2f}%",
            "heatmap_url": heatmap_url,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    app.run(port=5001, debug=True)