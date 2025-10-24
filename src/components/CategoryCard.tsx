import React from 'react';

interface CategoryCardProps {
  category: string;
  completed: number;
  total: number;
  progress: number;
  typeStats?: {
    labs: number;
    knowledgeChecks: number;
    exitTickets: number;
    demonstrations: number;
    activities: number;
  };
  onTap: () => void;
}
