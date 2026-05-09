import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model


datagen = ImageDataGenerator(rescale=1./255)

train_generator = datagen.flow_from_directory(
    '../Tumor_Brain_DataSet/Training',
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical'
)

test_generator = datagen.flow_from_directory(
    '../Tumor_Brain_DataSet/Testing',
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical'
)


base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)

predictions = Dense(4, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

for layer in base_model.layers:
    layer.trainable = False

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

print("Starting Training...")
model.fit(train_generator, epochs=10, validation_data=test_generator)


model.save('model/brain_tumor_model.h5')
print("Model saved successfully as brain_tumor_model.h5")