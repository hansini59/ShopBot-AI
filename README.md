📦 E-Commerce Sales Chatbot
An interactive, AI-powered sales chatbot integrated with an e-commerce platform to enable seamless product discovery, filtering, and purchase simulations for users.

🌟 Features
Responsive Chat Interface: Clean, modern UI for desktop, tablet, and mobile.

Smart Product Search: Users can search, explore, and filter products by category, price, and availability.

Secure Login & Authentication: Session-based login system to protect user sessions.

Session Tracking: Timestamped chat interactions for session continuity and analysis.

Backend API (Flask/Django): RESTful APIs handle product queries and serve mock inventory data.

Mock Inventory Database: 100+ sample products stored in an SQLite/PostgreSQL database.

Real-Time Chat Logs: Conversations stored for auditing and review.

Conversation Reset & Download: Users can reset chats or download session history.

🚀 Live Demo
[https://courageous-dango-d083aa.netlify.app/]

🛠️ Technologies Used
Frontend	Backend	Database
React / HTML / CSS	Python (Flask/Django)	SQLite / PostgreSQL
Bootstrap / Tailwind	REST APIs	100+ Mock Products

📦 Installation & Setup
🔹 Clone the repository
bash
Copy
Edit
git clone https://github.com/yourusername/ecommerce-chatbot.git
cd ecommerce-chatbot
🔹 Install backend dependencies
bash
Copy
Edit
pip install -r requirements.txt
🔹 Install frontend dependencies (if applicable)
bash
Copy
Edit
npm install
🔹 Start the development servers
Backend

bash
Copy
Edit
python app.py
Frontend

bash
Copy
Edit
npm run dev
🎮 How to Use
Login to the chatbot UI

Start chatting — ask about product categories, prices, availability

Filter and explore products through chatbot interactions

View chat history with timestamps

Reset or download chat sessions

🗄️ Project Structure
pgsql
Copy
Edit
ecommerce-chatbot/
├── backend/
│   ├── app.py                # Flask/Django main server
│   ├── database.db           # SQLite mock product inventory
│   └── requirements.txt      # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── README.md
└── screenshots/
    ├── login-page.png
    ├── chat-ui.png
    └── product-search.png
📖 Technical Documentation
Architecture Overview

REST API-based backend

Chatbot frontend integrated via API calls

Relational DB for product inventory (100+ items)

Choice of Tech

Flask for lightweight, fast REST APIs

React for dynamic, responsive UI

SQLite/PostgreSQL for structured mock inventory

Challenges & Solutions

Issue: Managing stateful chat sessions
Solution: Implemented session IDs and timestamps for each chat session.

Issue: Structuring mock inventory data dynamically
Solution: Populated inventory via a JSON file import to SQLite/PostgreSQL.

✨ Key Features
Modular, fault-tolerant backend structure

Clean, mobile-responsive frontend interface

Adheres to Python & JavaScript coding best practices

Fully documented codebase

📊 Evaluation Focus
Category	Deliverables
UI/UX	Smooth, intuitive chatbot UX
Code Quality	Clean, modular, well-commented
Innovation	Smart product filtering & chat session management
Documentation	Complete technical + project report

🤝 Contributing
Fork the repo

Create a new branch (git checkout -b feature/feature-name)

Commit changes (git commit -m 'Add new feature')

Push to branch (git push origin feature/feature-name)

Open a Pull Request

🙏 Acknowledgments
This project was built as part of a recruitment assessment for the [Company Name] internship via Internshala. Inspired by modern AI-powered chatbot solutions for e-commerce platforms.

📌 Final Deliverables
✅ GitHub repo with source code & README
