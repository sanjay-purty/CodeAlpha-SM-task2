import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Share your world with everyone",
      description: "Connect, share and explore amazing things around you.",
      image: "https://illustrations.popsy.co/white/shaking-hands.svg"
    },
    {
      title: "Connect with Friends",
      description: "Find your friends and see what they are up to in real-time.",
      image: "https://illustrations.popsy.co/white/digital-nomad.svg"
    },
    {
      title: "Explore the World",
      description: "Discover new places, people and trends from all over the globe.",
      image: "https://illustrations.popsy.co/white/location.svg"
    }

  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="onboarding-screen">
      <div className="onboarding-content">
        <div className="onboarding-image animate-fade-in" key={step}>
          <img src={steps[step].image} alt="onboarding" />
        </div>
        
        <div className="onboarding-text">
          <h2 className="animate-fade-in" key={`t-${step}`}>{steps[step].title}</h2>
          <p className="animate-fade-in" key={`d-${step}`}>{steps[step].description}</p>
        </div>
        
        <div className="onboarding-footer">
          <div className="step-indicators">
            {steps.map((_, i) => (
              <div key={i} className={`indicator ${i === step ? 'active' : ''}`}></div>
            ))}
          </div>
          
          <button className="next-btn" onClick={handleNext}>
            {step === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
