/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react'
import { assets, jobsData } from '../assets/assets'
import { Link } from "react-router-dom"
const Homepage = () => {
  let [categories, setCategories] = useState([]);
  let [location, setLocation] = useState([]);
  let [jobs, setJobs] = useState([]);
  let [allJobs, setAllJobs] = useState([]); // Store all fetched jobs

  const backendUrl = "https://job-portal-managemant.vercel.app"

  const fetchJobs = async () => {
    try {
      const response = await fetch(backendUrl + '/api/users/jobs')
      const data = await response.json()
      if (data.success) {
        setAllJobs(data.jobsdata)
        setJobs(data.jobsdata)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (allJobs.length === 0) return; // Wait for data

    let jobData = allJobs.filter((element) => {
      if (location.length > 0 && categories.length <= 0) {
        let values = location.includes(element.location);
        return values;
      }
      else if (categories.length > 0 && location.length <= 0) {
        let values2 = categories.includes(element.category);
        return values2
      }
      else if (categories.length > 0 && location.length > 0) {
        let values3 = categories.includes(element.category);
        let values4 = location.includes(element.location);
        return values3 && values4
      }
      else {
        return element;
      }
    });
    setJobs(jobData);
  }, [categories, location, allJobs]);

  let categoriescheckboxchange = (e) => {
    setCategories((value) => {
      let values = [...value];
      if (values.includes(e.target.value)) {
        let removedvalues = values.filter((element) => { return element !== e.target.value });
        return removedvalues;
      }
      else {
        values.push(e.target.value);
      }
      return values;
    });
  }

  let locationcheckboxchange = (e) => {
    setLocation((value) => {
      let values = [...value];
      if (values.includes(e.target.value)) {
        let removedvalues = values.filter((element) => { return element !== e.target.value });
        return removedvalues;
      }
      else {
        values.push(e.target.value);
      }
      return values;
    });
  }

  return (
    <div className="flex flex-col items-center">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-16 px-[5%] w-full flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
          Over 10,000+ jobs to apply
        </h1>
        <p className="mt-4 text-lg max-w-xl text-indigo-100">
          Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future
        </p>

        {/* Search Bar */}
        <div className="mt-10 bg-white rounded text-gray-600 p-2 shadow-lg w-full max-w-4xl flex flex-col md:flex-row items-center gap-2">

          <div className="flex items-center gap-2 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
            <img src={assets.search_icon} alt="Search" className="w-5 h-5 opacity-50" />
            <input
              type="text"
              placeholder="Search for jobs"
              className="w-full text-base outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 w-full px-4 py-2">
            <img src={assets.location_icon} alt="Location" className="w-5 h-5 opacity-50" />
            <input
              type="text"
              placeholder="Location"
              className="w-full text-base outline-none bg-transparent"
            />
          </div>

          <button className="bg-blue-600 text-white font-medium px-8 py-3 rounded hover:bg-blue-700 transition-colors w-full md:w-auto">
            Search
          </button>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="w-full px-[5%] my-20">
        <div className="border border-gray-200 p-10 rounded-xl shadow-sm flex flex-row items-center gap-8 justify-center">
          <p className="text-gray-500 font-medium whitespace-nowrap">Trusted by</p>
          <div className="flex justify-between items-center w-full max-w-5xl opacity-70 grayscale hover:grayscale-0 transition-all duration-500 overflow-x-auto md:overflow-hidden gap-8">
            <img src={assets.microsoft_logo} alt="Microsoft" className="h-8 md:h-10 object-contain shrink-0" />
            <img src={assets.walmart_logo} alt="Walmart" className="h-8 md:h-10 object-contain shrink-0" />
            <img src={assets.accenture_logo} alt="Accenture" className="h-8 md:h-10 object-contain shrink-0" />
            <img src={assets.samsung_logo} alt="Samsung" className="h-8 md:h-10 object-contain shrink-0" />
            <img src={assets.amazon_logo} alt="Amazon" className="h-8 md:h-10 object-contain shrink-0" />
            <img src={assets.adobe_logo} alt="Adobe" className="h-8 md:h-10 object-contain shrink-0" />
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 w-full px-[5%] my-10 mx-auto items-start">

        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4 bg-white shadow-md border border-gray-200 rounded p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Search by categories</h3>
          <div className="flex flex-col gap-3 text-gray-600">
            {['Programming', 'Data Science', 'Designing', 'Networking', 'Management', 'Cybersecurity'].map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                <input type="checkbox" onChange={categoriescheckboxchange} value={cat} className="w-4 h-4 accent-blue-600" />
                {cat}
              </label>
            ))}
          </div>

          <h3 className="font-bold text-lg mb-4 mt-8 text-gray-800">Search by location</h3>
          <div className="flex flex-col gap-3 text-gray-600">
            {['Bangalore', 'Washington', 'Hyderabad', 'Mumbai', 'California', 'Chennai', 'New York'].map((loc) => (
              <label key={loc} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                <input type="checkbox" value={loc} onChange={locationcheckboxchange} className="w-4 h-4 accent-blue-600" />
                {loc}
              </label>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="w-full lg:w-3/4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Latest jobs</h2>
            <p className="text-gray-500 mt-2">Get your desired job from top companies</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {jobs.map((job) => (
              <div key={job._id} className="p-6 shadow-sm border border-gray-100 rounded-lg bg-white hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <img src={assets.company_icon} alt={job.companyId.name} className="h-8 object-contain" />
                </div>

                <h4 className="font-bold text-xl text-gray-800 mb-2 truncate" title={job.title}>{job.title}</h4>

                <div className="flex gap-2 text-xs font-medium mb-4 flex-wrap">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-100">{job.location}</span>
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded border border-red-100">{job.level}</span>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {job.description.replace(/<[^>]*>/g, "").slice(0, 150)}...
                </p>

                <div className="mt-auto flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Link to={`/jobs/${job._id}`}>Apply Now</Link>
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-600 rounded py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Link to={`/jobs/${job._id}`}>Learn More</Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Homepage