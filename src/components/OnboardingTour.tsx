import React, { useState, useEffect } from 'react';
import { TourStep } from '../types';
import { OnboardingService } from '../services/onboardingService';

interface OnboardingTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '👋 Welcome to AWS RESTART Tracker!',
      content: 'Track your progress through the complete AWS RESTART program. Let me show you around!',
      target: 'global',
      position: 'center'
    },
    {
      id: 'progress-overview',
      title: '📊 Your Progress Overview',
      content: 'Here you can see your overall completion percentage and total modules completed.',
      target: '.progress-ring-container',
      position: 'bottom'
    },
    {
      id: 'module-types',
      title: '🎯 Module Types',
      content: 'Track different types of activities: Labs, Knowledge Checks, Exit Tickets, Demonstrations, and Activities.',
      target: '.module-type-stats',
      position: 'bottom'
    },
    {
      id: 'labs-demo',
      title: '🔬 Hands-on Labs',
      content: 'Click here to view all Lab exercises where you get hands-on AWS experience.',
      target: '.module-type-stats .bg-blue-500',
      position: 'bottom'
    },
    {
      id: 'categories',
      title: '📚 Learning Categories',
      content: 'Each category represents a major section of the AWS RESTART program. Click any category to see its modules.',
      target: '.categories-grid',
      position: 'top'
    },
    {
      id: 'quick-actions',
      title: '⚡ Quick Actions',
      content: 'Quickly jump to specific views like all modules, labs only, or exit tickets.',
      target: '.quick-actions',
      position: 'top'
    },
    {
      id: 'completion',
      title: '✅ Tracking Progress',
      content: 'Click any module to mark it as completed. Your progress saves automatically! Ready to start learning?',
      target: 'global',
      position: 'center'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      document.body.style.overflow = 'hidden';
      
      // Scroll to the first step's target
      setTimeout(() => {
        scrollToCurrentStep();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToCurrentStep();
    }
  }, [currentStep, isOpen]);

  const scrollToCurrentStep = () => {
    const step = tourSteps[currentStep];
    
    if (step.target && step.target !== 'global') {
      const element = document.querySelector(step.target);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
    }
  };

  const navigateToSection = (stepId: string) => {
    switch (stepId) {
      case 'labs-demo':
        // Navigate to Labs view
        window.location.hash = '/modules?type=labs';
        break;
      case 'categories':
        // Ensure we're on home page to see categories
        window.location.hash = '/';
        break;
      case 'quick-actions':
        // Scroll to quick actions
        const quickActions = document.querySelector('.quick-actions');
        if (quickActions) {
          quickActions.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
      default:
        // For other steps, just scroll to the element
        scrollToCurrentStep();
    }
  };

  const nextStep = () => {
    const currentStepId = tourSteps[currentStep].id;
    
    // Navigate before moving to next step
    navigateToSection(currentStepId);

    if (currentStep < tourSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 500);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    OnboardingService.completeOnboarding();
    onComplete();
  };

  const handleSkip = () => {
    onSkip();
  };

  // Function to handle direct navigation for specific steps
  const handleActionClick = (action: string) => {
    switch (action) {
      case 'view-labs':
        window.location.hash = '/modules?type=labs';
        handleComplete();
        break;
      case 'view-categories':
        window.location.hash = '/';
        handleComplete();
        break;
      default:
        nextStep();
    }
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isActionStep = step.id === 'labs-demo' || step.id === 'categories' || step.id === 'quick-actions';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{step.content}</p>
          
          {/* Action buttons for specific steps */}
          {isActionStep && (
            <div className="mt-4 flex space-x-3">
              {step.id === 'labs-demo' && (
                <button
                  onClick={() => handleActionClick('view-labs')}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                >
                  🔬 View Labs
                </button>
              )}
              {step.id === 'categories' && (
                <button
                  onClick={() => handleActionClick('view-categories')}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                >
                  📚 Explore Categories
                </button>
              )}
              {step.id === 'quick-actions' && (
                <button
                  onClick={nextStep}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors text-sm"
                >
                  ⚡ Try Quick Actions
                </button>
              )}
            </div>
          )}
          
          {/* Step Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-aws-blue' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isFirstStep
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Back
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Skip Tour
              </button>
              
              {!isActionStep && (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-aws-blue text-white rounded-lg font-medium hover:bg-aws-blue-dark transition-colors"
                >
                  {isLastStep ? 'Get Started!' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};