import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  BriefcaseIcon, 
  MapPinIcon, 
  PencilSquareIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Student User',
    email: 'student@example.com',
    role: 'Aspiring Developer',
    location: 'Bangalore, India',
    bio: 'Passionate about full-stack development and solving algorithmic problems. Currently focusing on React and DSA.',
    stats: {
      problemsSolved: 142,
      streak: 12,
      rank: 1543
    },
    preferences: {
      notifications: true,
      publicProfile: false
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile details saved successfully!");
  };

  const togglePreference = (key) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your personal information and account settings.</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isEditing 
              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20' 
              : 'bg-[#1a1a1a] text-white border border-[#333] hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          {isEditing ? (
            <>
              <CheckIcon className="w-5 h-5" /> Save Changes
            </>
          ) : (
            <>
              <PencilSquareIcon className="w-5 h-5" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#222] to-transparent"></div>
            
            <div className="relative z-10 w-24 h-24 rounded-full bg-[#1a1a1a] border-4 border-[#111] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
               <UserCircleIcon className="w-16 h-16 text-gray-500" />
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-[#111] rounded-full"></div>
            </div>

            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-orange-500 text-sm font-medium mb-4">{user.role}</p>

            <div className="flex gap-4 w-full border-t border-[#222] pt-4 mt-2">
               <div className="flex-1 text-center hover:bg-[#1a1a1a] rounded-lg p-1 transition-colors">
                  <div className="text-xl font-bold text-white">{user.stats.problemsSolved}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Solved</div>
               </div>
               <div className="flex-1 text-center border-l border-[#222] hover:bg-[#1a1a1a] rounded-lg p-1 transition-colors">
                  <div className="text-xl font-bold text-white">{user.stats.streak}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Day Streak</div>
               </div>
               <div className="flex-1 text-center border-l border-[#222] hover:bg-[#1a1a1a] rounded-lg p-1 transition-colors">
                  <div className="text-xl font-bold text-white">#{user.stats.rank}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Rank</div>
               </div>
            </div>
          </div>

          {/* Contact Info (Read Only) */}
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-4">
             <h3 className="text-white font-bold mb-2">Contact Information</h3>
             <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <EnvelopeIcon className="w-5 h-5" />
                <span className="text-sm">{user.email}</span>
             </div>
             <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <MapPinIcon className="w-5 h-5" />
                <span className="text-sm">{user.location}</span>
             </div>
             <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <BriefcaseIcon className="w-5 h-5" />
                <span className="text-sm">Available for opportunities</span>
             </div>
          </div>
        </div>

        {/* Right Column: Editable Details */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
              <h3 className="text-xl font-bold text-white mb-6">Personal Details</h3>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                       <input 
                         type="text" 
                         value={user.name} 
                         disabled={!isEditing}
                         onChange={(e) => setUser({...user, name: e.target.value})}
                         className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors ${!isEditing ? 'border-[#333] text-gray-400 cursor-not-allowed' : 'border-[#444]'}`}
                       />
                    </div>
                    <div>
                       <label className="block text-gray-400 text-sm font-medium mb-2">Role / Title</label>
                       <input 
                         type="text" 
                         value={user.role} 
                         disabled={!isEditing}
                         onChange={(e) => setUser({...user, role: e.target.value})}
                         className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors ${!isEditing ? 'border-[#333] text-gray-400 cursor-not-allowed' : 'border-[#444]'}`}
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={user.email} 
                      disabled={!isEditing}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors ${!isEditing ? 'border-[#333] text-gray-400 cursor-not-allowed' : 'border-[#444]'}`}
                    />
                 </div>

                 <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Location</label>
                    <input 
                      type="text" 
                      value={user.location} 
                      disabled={!isEditing}
                      onChange={(e) => setUser({...user, location: e.target.value})}
                      className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors ${!isEditing ? 'border-[#333] text-gray-400 cursor-not-allowed' : 'border-[#444]'}`}
                    />
                 </div>

                 <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Bio</label>
                    <textarea 
                      rows="4"
                      value={user.bio} 
                      disabled={!isEditing}
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                      className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none ${!isEditing ? 'border-[#333] text-gray-400 cursor-not-allowed' : 'border-[#444]'}`}
                    />
                 </div>
              </div>
           </div>

           {/* Settings Toggles (Interactive) */}
           <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
              <h3 className="text-xl font-bold text-white mb-6">Preferences</h3>
              <div className="space-y-4">
                 
                 {/* Notifications Toggle */}
                 <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-[#333] hover:border-[#444] transition-colors">
                    <div>
                       <h4 className="text-white font-medium">Email Notifications</h4>
                       <p className="text-gray-500 text-xs">Receive updates about your progress and new challenges.</p>
                    </div>
                    <div 
                      onClick={() => togglePreference('notifications')}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${user.preferences.notifications ? 'bg-orange-600' : 'bg-[#333]'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.preferences.notifications ? 'right-1' : 'left-1'}`}></div>
                    </div>
                 </div>

                 {/* Public Profile Toggle */}
                 <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-[#333] hover:border-[#444] transition-colors">
                    <div>
                       <h4 className="text-white font-medium">Public Profile</h4>
                       <p className="text-gray-500 text-xs">Allow others to see your rank and stats.</p>
                    </div>
                    <div 
                      onClick={() => togglePreference('publicProfile')}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${user.preferences.publicProfile ? 'bg-orange-600' : 'bg-[#333]'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.preferences.publicProfile ? 'right-1' : 'left-1'}`}></div>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
