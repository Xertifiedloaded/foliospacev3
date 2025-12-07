import React, { useState, useEffect } from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';

export default function TemplateSelector({ cvId, currentTemplate = 'professional-blue', userTier = 'FREE' }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPreview, setShowPreview] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (templateId, tier) => {
    if (tier === 'PREMIUM' && userTier !== 'PREMIUM') {
      alert('This template requires a Premium subscription. Upgrade to unlock!');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/cvs/${cvId}/template`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });

      if (response.ok) {
        setSelectedTemplate(templateId);
        alert('Template updated successfully! Download your CV to see the changes.');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template');
    } finally {
      setUpdating(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      professional: 'bg-blue-100 text-blue-700',
      creative: 'bg-purple-100 text-purple-700',
      minimal: 'bg-gray-100 text-gray-700',
      tech: 'bg-cyan-100 text-cyan-700',
      modern: 'bg-emerald-100 text-emerald-700',
    };
    return colors[category] || colors.professional;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
        <p className="text-gray-600">Select a professional template for your CV. Premium templates available with upgrade.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Professional', 'Creative', 'Minimal', 'Tech', 'Modern'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = template.id === selectedTemplate;
          const isPremium = template.tier === 'PREMIUM';
          const isLocked = isPremium && userTier !== 'PREMIUM';

          return (
            <div
              key={template.id}
              className={`relative group rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'border-blue-600 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {isPremium && (
                <div className="absolute top-3 right-3 z-10 bg-linear-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Premium
                </div>
              )}

              {isSelected && (
                <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Selected
                </div>
              )}

              <div
                className="relative h-64 cursor-pointer overflow-hidden"
                style={{ backgroundColor: template.style.backgroundColor }}
                onClick={() => setShowPreview(template.id)}
              >
                <div className="p-6 space-y-3">
                  <div
                    className="h-8 w-3/4 rounded"
                    style={{ backgroundColor: template.style.primaryColor }}
                  ></div>
                  <div
                    className="h-3 w-1/2 rounded"
                    style={{ backgroundColor: template.style.secondaryColor }}
                  ></div>
                  <div className="space-y-2 mt-4">
                    <div
                      className="h-2 w-full rounded"
                      style={{ backgroundColor: template.style.textColor, opacity: 0.3 }}
                    ></div>
                    <div
                      className="h-2 w-5/6 rounded"
                      style={{ backgroundColor: template.style.textColor, opacity: 0.3 }}
                    ></div>
                    <div
                      className="h-2 w-4/6 rounded"
                      style={{ backgroundColor: template.style.textColor, opacity: 0.3 }}
                    ></div>
                  </div>
                  <div
                    className="mt-4 h-6 w-2/3 rounded"
                    style={{ backgroundColor: template.style.accentColor, opacity: 0.5 }}
                  ></div>
                </div>

    
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                    Click to preview
                  </span>
                </div>

                {isLocked && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>


              <div className="p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>

                  <button
                    onClick={() => handleTemplateSelect(template.id, template.tier)}
                    disabled={updating || isSelected}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isLocked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isLocked ? 'Upgrade to Unlock' : isSelected ? 'Selected' : 'Select Template'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(null)}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">
                  {templates.find((t) => t.id === showPreview)?.name}
                </h3>
                <button
                  onClick={() => setShowPreview(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                {templates.find((t) => t.id === showPreview)?.description}
              </p>
              <div className="bg-gray-100 rounded-lg p-8 min-h-[500px]">
                <p className="text-center text-gray-500">Full preview would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {userTier === 'FREE' && (
        <div className="mt-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Unlock All Premium Templates</h3>
          <p className="mb-6 opacity-90">
            Get access to all professional templates and unlimited CV downloads with Premium
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
}