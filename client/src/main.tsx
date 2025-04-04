import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Custom CSS for cultural elements and animations
const style = document.createElement('style');
style.textContent = `
  .cultural-border {
    background-image: repeating-linear-gradient(45deg, #E6B17E, #E6B17E 8px, transparent 8px, transparent 16px);
    height: 3px;
  }

  .navbar-item {
    position: relative;
  }

  .navbar-item::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: #C45B3C;
    transition: width 0.3s;
  }

  .navbar-item:hover::after {
    width: 100%;
  }

  .section-divider {
    background-image: linear-gradient(90deg, transparent, #7D9D8C, transparent);
    height: 1px;
  }

  .poetry-card {
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .poetry-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .chat-message:nth-child(odd) {
    background-color: rgba(247, 243, 235, 0.7);
  }

  /* Book page animation */
  @keyframes pageFlip {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(180deg); }
  }

  .book-hover:hover .book-cover {
    animation: pageFlip 1.5s forwards;
    transform-style: preserve-3d;
  }

  /* Custom font styles */
  .font-display {
    font-family: 'Playfair Display', serif;
  }
  
  .font-body {
    font-family: 'Lora', serif;
  }
  
  .font-sans {
    font-family: 'Inter', sans-serif;
  }

  /* Custom colors */
  :root {
    --primary: 14 51% 50%;
    --primary-light: 14 51% 62%;
    --primary-dark: 14 51% 42%;
    
    --secondary: 151 14% 58%;
    --secondary-light: 151 14% 65%;
    --secondary-dark: 151 14% 41%;
    
    --accent: 35 69% 70%;
    --accent-light: 35 69% 77%;
    --accent-dark: 35 69% 58%;
    
    --neutral-cream: 43 44% 95%;
    --neutral-charcoal: 40 3% 16%;
  }
`;

document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
