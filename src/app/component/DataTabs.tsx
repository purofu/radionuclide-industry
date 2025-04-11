"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TabProps {
  activeTab: 'trials' | 'companies';
  setActiveTab: (tab: 'trials' | 'companies') => void;
}

/**
 * DataTabs Component - Toggles between different data visualization views
 * 
 * @param activeTab - Current active tab ('trials' or 'companies')
 * @param setActiveTab - Function to update the active tab
 */
const DataTabs: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  return (
    <motion.div
      className="flex mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <button 
        className={`px-4 py-2 rounded-md text-body-small font-helvetica-now mr-2 transition-colors ${
          activeTab === 'trials' ? 'bg-black text-white' : 'bg-light-grey text-black'
        }`}
        onClick={() => setActiveTab('trials')}
        aria-pressed={activeTab === 'trials'}
      >
        Clinical Trials
      </button>
      <button 
        className={`px-4 py-2 rounded-md text-body-small font-helvetica-now transition-colors ${
          activeTab === 'companies' ? 'bg-black text-white' : 'bg-light-grey text-black'
        }`}
        onClick={() => setActiveTab('companies')}
        aria-pressed={activeTab === 'companies'}
      >
        Companies
      </button>
    </motion.div>
  );
};

export default DataTabs; 