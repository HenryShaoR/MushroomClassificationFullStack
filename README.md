# Mushroom Classification Project Fullstack App

This project uses a YOLO-based model and a linear regression model to classify mushrooms from images. Follow the instructions below to set up and run the project.

---

## 🔧 Project Setup

Install required packages by running:

```shell
cd ./backend
pip install -r requirements.txt

cd ../frontend
npm install
```

---

### ✅ Configure the Project

1. **Download Pretrained Model** (or train your own model [here](https://github.com/HenryShaoR/MushroomClassification))
    - Go to this repository's [Releases](https://github.com/HenryShaoR/MushroomClassificationFullStack/releases) section and download the model files.
    - Move the downloaded files into `./backend`:
       - [cls.pt](https://github.com/HenryShaoR/MushroomClassification/releases/download/Models-V1/cls.pt)
       - [det.pt](https://github.com/HenryShaoR/MushroomClassification/releases/download/Models-V1/det.pt)
       - [lrm.kpl](https://github.com/HenryShaoR/MushroomClassification/releases/download/Models-V1/lrm.pkl)

---

## 🧪 Running the App

1. **Start the server**
    - Navigate to `./backend` and run:
      ```
      uvicorn main:app
      ```

2. **Start the frontend**
    - Navigate to `./frontend` and run:
      ```
      npm run dev
      ```

3. **Use the app in your browser**
    - In your browser, open:
      ```
      http://localhost:5173
      ```
      or an alternative port assigned if `5173` is unavailable.

---

## 📁 Folder Structure Overview

```
Project Root
├── backend/
│   ├── cls.pt
│   ├── det.pt
│   ├── lrm.pkl
│   ├── main.py
│   └── requirements.txt
│
└── frontend/
    ├── node_modules/
    ├── src/
    │   ├── Component/
    │   │   ├── DropDownList.tsx
    │   │   ├── FileUpload.tsx
    │   │   └── ImageUpload.tsx
    │   │
    │   ├── App.tsx
    │   ├── features.ts
    │   ├── index.css
    │   ├── main.tsx
    │   ├── types.ts
    │   └── util.ts
    │
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.js
    └── vite.config.ts

```

---

## ⚙️ System and Environment
The project is expected to run on Windows, macOS, and Linux systems with Python 3.10.

It has been tested based on the following configurations with Node.js v23.9.0:

| OS                | CPU              | GPU                                           | RAM         | Storage      |
|-------------------|------------------|-----------------------------------------------|-------------|--------------|
| Windows 11 (25H2) | Intel i9-13980HX | NVIDIA RTX 4080 Laptop (12GB VRAM, CUDA 13.0) | 32G DDR5    | 2TB NVMe SSD |
| macOS (26.0.1)    | Apple M3         | Integrated GPU                                | 16G Unified | 1TB SSD      |
