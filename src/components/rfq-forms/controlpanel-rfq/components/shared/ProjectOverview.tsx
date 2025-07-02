import React from 'react';
import { FormData } from '../../types/types';

interface ProjectOverviewProps {
  formData: FormData;
  handleChange: (field: keyof FormData, value: string) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ formData, handleChange }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
        Project Overview
      </h2>
      
      <div className="grid md:grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Title *
          </label>
          <input
            type="text"
            value={formData.projectTitle}
            onChange={(e) => handleChange('projectTitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brief Project Description *
          </label>
          <textarea
            value={formData.projectDescription}
            onChange={(e) => handleChange('projectDescription', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what this PLC project does..."
          />
        </div>


      </div>
    </section>
  );
};

export default ProjectOverview;
