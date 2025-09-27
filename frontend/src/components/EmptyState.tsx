import React from "react";
import { motion } from "framer-motion";
import { Users, Plus } from "lucide-react";

interface EmptyStateProps {
  onAddPatient: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddPatient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Users className="w-12 h-12 text-gray-400" />
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No patients registered yet
      </h3>

      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Get started by registering your first patient. You can add their
        information and upload their document photo.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddPatient}
        className="btn btn-primary px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add First Patient</span>
      </motion.button>
    </motion.div>
  );
};

export default EmptyState;
