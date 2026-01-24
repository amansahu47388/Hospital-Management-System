import React from "react";
import { Edit2,Phone, Mail, MapPin, Heart, User, Badge, Zap,} from "lucide-react";

export default function OPDHeader({ patient, onEditClick }) {
  return (
    <div className="mx-4 md:mx-6 mb-6">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-purple-200">
        {/* Top Purple Gradient Bar */}

        <div className="
  bg-gradient-to-r from-[#6046B5] via-[#7C5ACE] to-[#8A63D2]
  px-4 sm:px-6
  py-6
">
          <div className="
    flex flex-col md:flex-row
    md:items-end
    items-center
    gap-4 md:gap-6
    w-full
  ">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="
        w-20 h-20
        sm:w-24 sm:h-24
        bg-white
        rounded-xl
        border-4 border-white
        shadow-lg
        flex items-center justify-center
      ">
                {patient.photo ? (
                  <img
                    src={patient.photo}
                    alt={patient.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <User size={40} className="sm:size-12 text-[#6046B5]" />
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="
      flex-1
      text-white
      text-center md:text-left
    ">
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold">
                {patient.name}
              </h1>
              <p className="text-purple-100 text-xs sm:text-sm md:text-base">
                OPD-ID:{patient.admission.opdNumber} • Case-ID:{patient.admission.caseId}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="
      flex flex-col sm:flex-row
      gap-2
      w-full md:w-auto
    ">
              <button
                onClick={onEditClick}
                className="
          w-full sm:w-auto
          flex items-center justify-center gap-2
          bg-white text-[#6046B5]
          px-4 py-2
          rounded-lg font-semibold
          hover:bg-purple-50 transition
          shadow-lg
        ">
                <Edit2 size={18} />
                <span className="inline md:inline">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Patient Info Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Basic Info */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge size={18} className="text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Patient ID</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{patient.id}</p>
            <p className="text-xs text-gray-500 mt-1">
              {patient.gender} • {patient.age}
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Contact</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{patient.phone}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Mail size={14} /> {patient.email}
            </p>
          </div>

          {/* Location Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Bed Location</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {patient.admission.bed}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {patient.admission.bedGroup}
            </p>
          </div>

          {/* Health Status */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={18} className="text-red-600" />
              <p className="text-sm text-gray-600 font-medium">Status</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${patient.status === "Active" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
              <p className="text-sm font-semibold text-gray-900">{patient.status || "Active"}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Admitted {patient.admission.date}
            </p>
          </div>
        </div>

        {/* Secondary Info Section */}
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Doctor Info */}
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Consultant Doctor
            </p>
            <p className="text-lg font-bold text-indigo-700">
              {patient.admission.consultant}
            </p>
          </div>

          {/* Address    Info */}
          <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Address</p>
            </div>
            <p className="text-lg font-bold text-cyan-700">{patient.address}</p>

          </div>

          {/* Health Summary */}
          <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Blood Group & Allergies
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-rose-700">
                {patient.bloodGroup}
              </span>
              <div className="text-xs">
                <p className="text-red-600 font-semibold">
                  {patient.knownAllergies.join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 font-medium">Guardian</p>
            <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-1">
              <User size={18} className="text-orange-600" />
              {patient.guardianName}
            </p>
          </div>
        </div>

        {/* Vitals Quick View */}
        <div className="px-6 pb-6 border-t border-gray-200 pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" />
            Quick Vitals
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Height</p>
              <p className="text-sm font-bold text-blue-700">
                {patient.vitals.height}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Weight</p>
              <p className="text-sm font-bold text-green-700">
                {patient.vitals.weight}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">BMI</p>
              <p className="text-sm font-bold text-red-700">{patient.vitals.bmi}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">BP</p>
              <p className="text-sm font-bold text-purple-700">
                {patient.vitals.bloodPressure}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Temp</p>
              <p className="text-sm font-bold text-orange-700">
                {patient.vitals.temperature}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">HR</p>
              <p className="text-sm font-bold text-pink-700">
                {patient.vitals.heartRate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
