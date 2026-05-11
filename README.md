# 🧠 Medical Imaging Platform with AI Integration

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![AI Framework](https://img.shields.io/badge/AI-TensorFlow%20%7C%20Keras-orange)

An intelligent, full-stack medical imaging platform built as a Graduation Project. The system allows patients to securely upload brain MRI scans and assigns them to specialized doctors. Behind the scenes, a Deep Learning AI model analyzes the scans in real-time, detecting brain tumors (Glioma, Meningioma, Pituitary) and generating visual Heatmaps (Grad-CAM) to assist doctors in making accurate, fast diagnoses.

---

## ✨ Key Features

- **🤖 AI-Powered Analysis:** Real-time tumor detection using a fine-tuned MobileNetV2 Deep Learning model.
- **🗺️ Heatmap Visualization:** Generates Grad-CAM heatmaps highlighting the exact regions of interest in the MRI scan.
- **👨‍⚕️ Interactive Doctor Dashboard:** Doctors can review AI preliminary reports, adjust confidence scores, and manually draw diagnostic annotations over the MRI.
- **📄 Automated PDF Reports:** Generates professional, downloadable Medical Reports containing patient details, the AI analysis, the doctor's final diagnosis, and the visual heatmaps.
- **🔐 Secure Access:** Role-based access control (RBAC) separating Patient, Doctor, and Admin workspaces.
- **🛡️ Robust Architecture:** Features auto-reconnect logic for MongoDB and independent microservices.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
- **React.js**: Modern, reactive user interface.
- **Tailwind CSS**: Beautiful, fully responsive styling.
- **React Konva**: Advanced HTML5 Canvas interactions for manual heatmap drawing.
- **Lucide Icons**: Premium vector icons.

### Backend (API & Database)
- **Node.js & Express.js**: Fast and scalable RESTful API.
- **MongoDB Atlas**: Cloud-based NoSQL database for flexible patient and report data storage.
- **Mongoose**: Object Data Modeling (ODM) with custom connection retry mechanisms.
- **JWT**: Secure authentication tokens.

### AI Microservice (Deep Learning)
- **Python & Flask**: Lightweight API to serve the Deep Learning model.
- **TensorFlow / Keras**: The core AI engine running the CNN classification model.
- **OpenCV**: Image processing and blending for Heatmap generation.
- **NumPy**: Matrix and numerical calculations.

---

## 🚀 How to Run the Project Locally

The project is split into three independent services. To run the platform locally, you must start all three in separate terminal windows.

### 1. Start the Frontend
```bash
cd frontend
npm install
npm start
```
*The website will be available at: http://localhost:3000*

### 2. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
*The API will run on: http://localhost:5000*

### 3. Start the AI Service
Ensure you have a Python virtual environment (`.venv`) set up in the root directory with the required libraries installed.
```bash
cd Ai_Services
..\.venv\Scripts\python.exe app.py
```
*The AI Engine will listen on: http://127.0.0.1:5001*

---

## 📸 Screenshots

*(Add screenshots of your Patient Dashboard, Doctor Dashboard, and AI Heatmap here to impress visitors!)*

---

## 🎓 About This Project

This platform was developed as a comprehensive Graduation Project bridging Software Engineering and Artificial Intelligence in the Medical field. It demonstrates how AI can act as a "second pair of eyes" for radiologists, improving workflow efficiency without replacing the human expert's final judgment.
