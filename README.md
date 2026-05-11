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

*(<img width="1872" height="957" alt="patientDashboard" src="https://github.com/user-attachments/assets/4c08f390-130b-45e8-bd82-6cdc203ee441" />
<img width="1918" height="957" alt="ErrorPage" src="https://github.com/user-attachments/assets/80bb9ece-4bf0-4efb-a141-d170fd53328f" />
<img width="962" height="736" alt="responsiveDone" src="https://github.com/user-attachments/assets/cebe1046-5ea8-420f-b8ba-dffc4b1fccfd" />
<img width="1645" height="917" alt="controlDoctorInHeatmap" src="https://github.com/user-attachments/assets/bcb6ea11-c6dd-41c1-aec9-110f66e8aeae" />
<img width="1918" height="967" alt="projectSignup" src="https://github.com/user-attachments/assets/94367073-053a-443d-b494-07aac3f57552" />
<img width="1897" height="942" alt="editReport" src="https://github.com/user-attachments/assets/1ec98d0f-4668-494f-8185-1ec57de1d793" />
<img width="1917" height="972" alt="projectSignin" src="https://github.com/user-attachments/assets/0988ea36-539e-4d6b-b70e-e9f80d9ed98b" />
<img width="1192" height="892" alt="Screenshot ProjectGraduation" src="https://github.com/user-attachments/assets/67b1f0e7-9808-4936-9133-a8dbc92943af" />
<img width="1918" height="952" alt="doctorDashboard" src="https://github.com/user-attachments/assets/ecfc6f3f-b48f-4e7d-9574-72f2e4621433" />
<img width="1885" height="896" alt="uploadMri" src="https://github.com/user-attachments/assets/4e690818-c826-4331-bce8-a4f10d657be1" />
<img width="1048" height="858" alt="pdfReport" src="https://github.com/user-attachments/assets/3499cca9-310e-47fa-a146-1be95a01db80" />
)*

---

## 🎓 About This Project

This platform was developed as a comprehensive Graduation Project bridging Software Engineering and Artificial Intelligence in the Medical field. It demonstrates how AI can act as a "second pair of eyes" for radiologists, improving workflow efficiency without replacing the human expert's final judgment.
