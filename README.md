<div align="center">

# 🧠 Medical Imaging Platform

### AI-Powered Brain Tumor Detection & Clinical Reporting System

<br/>

<p>
  <img src="https://img.shields.io/badge/Status-Completed-22c55e?style=flat-square&logo=checkmarx&logoColor=white"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-3b82f6?style=flat-square"/>
  <img src="https://img.shields.io/badge/License-MIT-a855f7?style=flat-square"/>
  <img src="https://img.shields.io/badge/Type-Graduation%20Project-f59e0b?style=flat-square&logo=academia&logoColor=white"/>
</p>

<br/>

> **An intelligent, full-stack medical imaging platform bridging Artificial Intelligence and clinical radiology.**
> Patients upload brain MRI scans → AI analyzes them in real-time → Doctors review, annotate, and deliver final reports.

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><b>🏠 Landing Page</b></td>
    <td align="center"><b>🔐 Sign In</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/67b1f0e7-9808-4936-9133-a8dbc92943af" alt="Landing Page" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/0988ea36-539e-4d6b-b70e-e9f80d9ed98b" alt="Sign In" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>📝 Sign Up</b></td>
    <td align="center"><b>🩺 Doctor Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/94367073-053a-443d-b494-07aac3f57552" alt="Sign Up" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/ecfc6f3f-b48f-4e7d-9574-72f2e4621433" alt="Doctor Dashboard" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>🗺️ AI Heatmap Editor</b></td>
    <td align="center"><b>✏️ Report Editor</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/bcb6ea11-c6dd-41c1-aec9-110f66e8aeae" alt="Heatmap Editor" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/1ec98d0f-4668-494f-8185-1ec57de1d793" alt="Edit Report" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>👤 Patient Dashboard</b></td>
    <td align="center"><b>📤 Upload MRI</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/4c08f390-130b-45e8-bd82-6cdc203ee441" alt="Patient Dashboard" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/4e690818-c826-4331-bce8-a4f10d657be1" alt="Upload MRI" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>📄 PDF Medical Report</b></td>
    <td align="center"><b>📱 Responsive Design</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/3499cca9-310e-47fa-a146-1be95a01db80" alt="PDF Report" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/cebe1046-5ea8-420f-b8ba-dffc4b1fccfd" alt="Responsive Design" width="100%"/></td>
  </tr>
</table>

---

## ✨ Features

| Feature | Description |
|:---|:---|
| 🤖 **AI Tumor Detection** | Real-time brain tumor classification (Glioma, Meningioma, Pituitary, No Tumor) via a fine-tuned **MobileNetV2** CNN |
| 🗺️ **Grad-CAM Heatmaps** | Automatic visual explanation of AI decisions — highlights the exact region of interest on the MRI scan |
| ✏️ **Manual Annotation** | Doctors can draw and adjust heatmap regions directly on the scan using an interactive canvas |
| 📊 **Confidence Control** | Doctors can manually override the AI confidence score before sending the final report |
| 🟢 **Healthy Case Visualization** | Negative results render a calm green/blue "healthy" heatmap instead of a hot red overlay |
| 📄 **Automated PDF Reports** | One-click generation of a professional medical PDF with patient info, AI analysis, and visual heatmaps |
| 🔐 **Role-Based Access (RBAC)** | Separated workspaces for **Patient**, **Doctor**, and **Admin** roles with JWT authentication |
| 🔔 **Real-Time Notifications** | In-app toast alerts when a doctor completes a review or new scans are awaiting analysis |
| ⏱️ **Full Audit Timestamps** | Every action (upload, analysis, review, send) is logged with precise date and time |
| 📱 **Fully Responsive** | Optimized for all screen sizes — desktop, tablet, and mobile |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                     React.js  :3000                         │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (Node.js)                     │
│            Express.js + JWT Auth  :5000                     │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│   │  User Auth   │  │ Image Routes │  │  Report Routes   │ │
│   └──────────────┘  └──────┬───────┘  └──────────────────┘ │
└──────────────────────────┬─┴───────────────────────────────┘
              │             │ HTTP POST (image)
              ▼             ▼
┌─────────────────┐  ┌─────────────────────────────────────┐
│  MongoDB Atlas  │  │        AI MICROSERVICE (Python)      │
│  (Cloud NoSQL)  │  │     Flask + TensorFlow/Keras  :5001  │
└─────────────────┘  │  MobileNetV2 CNN + Grad-CAM OpenCV  │
                     └─────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### 🎨 Frontend

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router"/>
  <img src="https://img.shields.io/badge/Lucide_Icons-f97316?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide Icons"/>
</p>

| Technology | Purpose |
|:---|:---|
| **React.js 18** | Component-based UI framework |
| **Tailwind CSS** | Utility-first responsive styling |
| **Framer Motion** | Smooth page and element animations |
| **React Konva** | HTML5 Canvas for interactive heatmap drawing |
| **Lucide Icons** | Clean, consistent icon set |
| **React Hot Toast** | Elegant notification toasts |

---

### ⚙️ Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Multer-FF6C37?style=for-the-badge&logo=files&logoColor=white" alt="Multer"/>
</p>

| Technology | Purpose |
|:---|:---|
| **Node.js + Express** | RESTful API server |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose** | ODM with auto-reconnect logic |
| **JWT** | Secure, stateless authentication |
| **PDFKit** | Dynamic PDF report generation |
| **Multer** | MRI image file upload handling |

---

### 🤖 AI Microservice

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
  <img src="https://img.shields.io/badge/Keras-D00000?style=for-the-badge&logo=keras&logoColor=white" alt="Keras"/>
  <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" alt="OpenCV"/>
  <img src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy"/>
</p>

| Technology | Purpose |
|:---|:---|
| **Python + Flask** | Lightweight model-serving API |
| **TensorFlow / Keras** | Deep Learning model engine |
| **MobileNetV2** | Transfer-learned CNN classifier (4 classes) |
| **OpenCV** | Grad-CAM heatmap generation & blending |
| **NumPy** | Numerical array operations |

---

### 🗄️ Database & Tools

<p>
  <img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code"/>
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman"/>
</p>

---

## 🚀 Getting Started

The project consists of **three independent services**. Start each in a separate terminal.

### Prerequisites
- ![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)
- ![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)

### 1. Clone the Repository
```bash
git clone https://github.com/MG-0/Medical-Imaging-Platform.git
cd Medical-Imaging-Platform
```

### 2. Environment Variables

Create a `.env` file inside the `/backend` folder:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
AI_SERVICE_URL=http://127.0.0.1:5001
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm start
```
> 🌐 Runs at **http://localhost:3000**

### 4. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
> ⚙️ Runs at **http://localhost:5000**

### 5. Start the AI Microservice
```bash
cd Ai_Services
python -m venv .venv

# Windows
.\.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```
> 🤖 Runs at **http://127.0.0.1:5001**

---

## 👥 User Roles

| Role | Capabilities |
|:---|:---|
| 👤 **Patient** | Upload MRI scans, view AI + doctor reports, download PDF, receive notifications |
| 🩺 **Doctor** | View all pending scans, review AI heatmaps, manually annotate, adjust confidence, write & send final reports |
| 🛡️ **Admin** | Full access — can manage users, assign cases, and review all reports |

---

## 🎓 About This Project

This platform was developed as a comprehensive **Graduation Project** combining Software Engineering and Artificial Intelligence in the Medical domain.

The core idea is using AI as a **"second pair of eyes"** for radiologists — not to replace medical expertise, but to accelerate preliminary screening, reduce error rates, and provide visual evidence for diagnostic decisions.

> ⚠️ **Disclaimer:** This system is built for **academic and research purposes only**. It is not intended for clinical use or medical decision-making.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ as a Graduation Project

</div>
