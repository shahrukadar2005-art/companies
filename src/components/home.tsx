'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Building2, MapPin, Briefcase, ChevronDown, Loader2 } from 'lucide-react';

// Mock company data
const MOCK_COMPANIES = [
  { id: 1, name: 'Tech Innovators Inc', location: 'San Francisco, CA', industry: 'Technology', employees: 250, founded: 2015 },
  { id: 2, name: 'Green Energy Solutions', location: 'Austin, TX', industry: 'Energy', employees: 180, founded: 2018 },
  { id: 3, name: 'HealthCare Plus', location: 'New York, NY', industry: 'Healthcare', employees: 500, founded: 2010 },
  { id: 4, name: 'Finance Dynamics', location: 'Chicago, IL', industry: 'Finance', employees: 350, founded: 2012 },
  { id: 5, name: 'EduTech Pro', location: 'Boston, MA', industry: 'Education', employees: 120, founded: 2019 },
  { id: 6, name: 'Retail Masters', location: 'Seattle, WA', industry: 'Retail', employees: 800, founded: 2008 },
  { id: 7, name: 'CloudNet Systems', location: 'San Jose, CA', industry: 'Technology', employees: 420, founded: 2016 },
  { id: 8, name: 'Solar Bright Co', location: 'Phoenix, AZ', industry: 'Energy', employees: 95, founded: 2020 },
  { id: 9, name: 'MediCore Labs', location: 'Los Angeles, CA', industry: 'Healthcare', employees: 280, founded: 2014 },
  { id: 10, name: 'Investment Group LLC', location: 'New York, NY', industry: 'Finance', employees: 450, founded: 2009 },
  { id: 11, name: 'Learning Hub', location: 'Denver, CO', industry: 'Education', employees: 75, founded: 2021 },
  { id: 12, name: 'Fashion Forward', location: 'Miami, FL', industry: 'Retail', employees: 320, founded: 2017 },
  { id: 13, name: 'AI Solutions Corp', location: 'San Francisco, CA', industry: 'Technology', employees: 190, founded: 2019 },
  { id: 14, name: 'Wind Power Inc', location: 'Portland, OR', industry: 'Energy', employees: 140, founded: 2015 },
  { id: 15, name: 'Wellness Centers', location: 'Atlanta, GA', industry: 'Healthcare', employees: 210, founded: 2013 },
];

type Company = typeof MOCK_COMPANIES[0];

type SortField = 'name' | 'employees' | 'founded';
type SortOrder = 'asc' | 'desc';

const CompaniesDirectory = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Sorting states
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Simulate API fetch
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCompanies(MOCK_COMPANIES);
        setError('');
      } catch (err) {
        setError('Failed to load companies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Get unique industries and locations
  const industries = useMemo(() => 
    ['all', ...Array.from(new Set(companies.map(c => c.industry)))],
    [companies]
  );

  const locations = useMemo(() => 
    ['all', ...Array.from(new Set(companies.map(c => c.location)))],
    [companies]
  );

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
      const matchesLocation = selectedLocation === 'all' || company.location === selectedLocation;
      return matchesSearch && matchesIndustry && matchesLocation;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [companies, searchTerm, selectedIndustry, selectedLocation, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCompanies.length / itemsPerPage);
  const paginatedCompanies = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCompanies.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedCompanies, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedIndustry, selectedLocation]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSelectedLocation('all');
    setSortField('name');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-xl font-semibold mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Building2 className="w-10 h-10 text-indigo-600" />
            Companies Directory
          </h1>
          <p className="text-gray-600">Browse and filter through our company database</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Companies
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry === 'all' ? 'All Industries' : industry}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Sort and Reset */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                sortField === 'name' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('employees')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                sortField === 'employees' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Employees {sortField === 'employees' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('founded')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                sortField === 'founded' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Founded {sortField === 'founded' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={resetFilters}
              className="ml-auto px-4 py-1 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {paginatedCompanies.length} of {filteredAndSortedCompanies.length} companies
        </div>

        {/* Companies Grid */}
        {paginatedCompanies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedCompanies.map((company) => (
                <div 
                  key={company.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                      {company.industry}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{company.name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{company.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        <strong>{company.employees}</strong> employees
                      </span>
                      <span className="text-gray-500">
                        Est. {company.founded}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompaniesDirectory;