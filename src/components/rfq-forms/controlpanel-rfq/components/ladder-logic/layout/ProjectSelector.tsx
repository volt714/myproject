import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';

interface ProjectSelectorProps {
  projectName: string;
  companyName: string;
  onProjectChange: (project: string) => void;
  onCompanyChange: (company: string) => void;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projectName,
  companyName,
  onProjectChange,
  onCompanyChange,
}) => {
  const [isProjectOpen, setIsProjectOpen] = React.useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = React.useState(false);
  
  const projectDropdownRef = React.useRef<HTMLDivElement>(null);
  const companyDropdownRef = React.useRef<HTMLDivElement>(null);

  const { data: projects, error: projectsError } = useSWR<string[]>('/api/projects', fetcher);
  const { data: companies, error: companiesError } = useSWR<string[]>('/api/companies', fetcher);

  const handleProjectSelect = (project: string) => {
    onProjectChange(project);
    setIsProjectOpen(false);
  };

  const handleCompanySelect = (company: string) => {
    onCompanyChange(company);
    setIsCompanyOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setIsProjectOpen(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="relative" ref={projectDropdownRef}>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <button
          onClick={() => setIsProjectOpen(!isProjectOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span>{projectName}</span>
          <ChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-400" />
        </button>

        {isProjectOpen && (
          <div className="absolute right-0 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {projectsError && <div>Failed to load projects</div>}
              {!projects && !projectsError && <div>Loading...</div>}
              {projects?.map((project) => (
                <button
                  key={project}
                  onClick={() => handleProjectSelect(project)}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  {project}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={companyDropdownRef}>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <button
          onClick={() => setIsCompanyOpen(!isCompanyOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span>{companyName}</span>
          <ChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-400" />
        </button>

        {isCompanyOpen && (
          <div className="absolute right-0 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {companiesError && <div>Failed to load companies</div>}
              {!companies && !companiesError && <div>Loading...</div>}
              {companies?.map((company) => (
                <button
                  key={company}
                  onClick={() => handleCompanySelect(company)}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  {company}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSelector; 