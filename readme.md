🔍 Foundify Agent

AI-Powered Smart Item Recovery & Lost-and-Found Assistant

Foundify Agent is an intelligent AI-powered lost-and-found assistant designed to help students recover misplaced belongings within Parul University.

It combines conversational AI, intelligent image matching, and campus-specific item management to simplify the lost-and-found process.

🌐 Live Applications

Application	Live URL
Foundify – Main Application	https://foundify-9osq.onrender.com
Foundify Agent – AI Assistant	https://foundifyagent.versel.app

✨ Key Features

* AI Conversational Agent: Human-like conversations with contextual understanding.
* Lost Item Reporting: Report misplaced belongings through natural language.
* Found Item Reporting: Register recovered items with descriptions and images.
* AI Image Matching: Identify potentially matching lost and found items.
* Smart Search: Search by item name, category, description, and location.
* Campus Location Awareness: Designed for Parul University campus locations.
* Match Recommendations: Suggest potential matches using image and text similarity.
* Recovery Assistance: Guide students through verification and collection.

🎯 Supported Item Categories

* Mobile Phones
* Laptops
* Backpacks
* Wallets
* Earphones and Headphones
* Watches
* Books and Notebooks
* Water Bottles
* Chargers and Accessories
* Other Personal Belongings

📍 Campus Coverage

Current Deployment: Parul University

Foundify Agent currently focuses on Parul University campus locations and its lost-and-found ecosystem.

🧠 AI Agent Workflow

1. Understand the student’s request.
2. Identify the lost or found item category.
3. Ask contextual follow-up questions.
4. Collect item descriptions and distinguishing details.
5. Identify relevant campus locations.
6. Search available lost-and-found records.
7. Find potential matches using AI.
8. Present relevant results.
9. Guide students through ownership verification and recovery.

🏗️ System Architecture

             STUDENT / USER
                    |
                    v
             FOUNDiFY FRONTEND
                    |
                    v
             FOUNDiFY AI AGENT
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Intent    Context    AI Response
     Recognition Management Generation
          |         |         |
          +---------+---------+
                    |
                    v
               BACKEND API
                    |
          +---------+---------+
          |         |         |
          v         v         v
       MongoDB   Image AI   Matching
       Database  Service    Engine
                    |
                    v
              MATCH RESULTS
                    |
                    v
           STUDENT VERIFICATION
                    |
                    v
               ITEM RECOVERY

🛠️ Technology Stack

Component	Technology
Frontend	React / TypeScript
Styling	Tailwind CSS
Backend	Node.js / Go
Database	MongoDB
AI Integration	LLM API
Image Matching	Computer Vision / Embeddings
API Testing	Postman
Deployment	Vercel / Render
Version Control	Git / GitHub

Refer to the actual implementation for the exact technologies used.

🚀 Getting Started

Clone the repository

git clone https://github.com/YOUR_USERNAME/foundify-agent.git
cd foundify-agent

Install dependencies

npm install

Configure environment variables

Create a .env file and configure the required credentials.

MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key
JWT_SECRET=your_jwt_secret

Run locally

npm run dev

Follow the individual frontend and backend setup instructions where applicable.

🔐 Security & Privacy

* Environment-based secret management.
* Secure API communication.
* Server-side input validation.
* Authentication and authorization.
* Protected user and item records.
* Ownership verification before item handover.

🔮 Future Enhancements

* Voice-based lost-and-found reporting.
* Multilingual AI conversations.
* Real-time match notifications.
* Advanced multimodal AI matching.
* Administrative dashboard.
* QR-based item verification.
* Expansion to multiple universities.

🎓 Project Information

Detail	Information
Project	Foundify Agent
Category	Artificial Intelligence / Machine Learning
Domain	Smart Campus / Lost and Found
Initial Deployment	Parul University
Purpose	Intelligent campus Management

📜 Disclaimer

Foundify is an academic and demonstration-oriented project. AI-generated matches are recommendations, not proof of ownership. Proper verification is required before recovering an item.

⸻

Built with ❤️ to make lost things found again.

Foundify — Everything you campus needs.