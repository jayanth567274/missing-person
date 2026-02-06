import React, { useState } from 'react';
import { MissingPersonData } from '../types';
import { Upload, Search, MapPin, User, Calendar } from 'lucide-react';

interface Props {
  onSubmit: (data: MissingPersonData) => void;
  isLoading: boolean;
}

export const MissingPersonForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<MissingPersonData>({
    name: '',
    age: '',
    lastKnownLocation: '',
    lastSeenDate: '',
    clothing: '',
    features: '',
    notes: '',
    image: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Initiate New Search
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Provide all known details. The AI will cross-reference with geospatial data and public records.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">Reference Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors relative">
              <div className="space-y-1 text-center">
                {formData.image ? (
                   <div className="relative">
                      <img 
                        src={URL.createObjectURL(formData.image)} 
                        alt="Preview" 
                        className="mx-auto h-48 object-cover rounded-md"
                      />
                      <button 
                        type="button"
                        onClick={() => setFormData(p => ({...p, image: null}))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        Remove
                      </button>
                   </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input type="text" name="name" required className="block w-full pl-10 sm:text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Age</label>
            <input type="text" name="age" className="mt-1 block w-full sm:text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="e.g. 24" value={formData.age} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Last Seen Date & Time</label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-400" />
              </div>
              <input type="datetime-local" name="lastSeenDate" className="block w-full pl-10 sm:text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border" value={formData.lastSeenDate} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Location & Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Last Known Location</label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <input type="text" name="lastKnownLocation" required className="block w-full pl-10 sm:text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="e.g. Central Station, NYC" value={formData.lastKnownLocation} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Clothing Worn</label>
            <input type="text" name="clothing" className="mt-1 block w-full sm:text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="Red hoodie, blue jeans..." value={formData.clothing} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Distinctive Features</label>
            <input type="text" name="features" className="mt-1 block w-full sm:text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="Tattoo on left arm, glasses..." value={formData.features} onChange={handleChange} />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
           <label className="block text-sm font-medium text-slate-700">Additional Notes</label>
           <textarea name="notes" rows={3} className="mt-1 block w-full sm:text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border" placeholder="Medical conditions, habits, probable destinations..." value={formData.notes} onChange={handleChange}></textarea>
        </div>

        <div className="col-span-1 md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
          >
            {isLoading ? 'Analyzing Data & Scanning Databases...' : 'Start Investigation'}
          </button>
        </div>
      </form>
    </div>
  );
};
