const Profile = require('../models/profileModel');

const generateNextProfileId = async () => {
  const records = await Profile.find({ profileId: /^PR\d+$/ }, { profileId: 1 }).lean();
  const highest = records.reduce((max, record) => Math.max(max, Number(record.profileId.slice(2)) || 0), 0);
  return `PR${highest + 1}`;
};

const findProfile = (query = {}) => {
  if (query.profileId) return Profile.findOne({ profileId: query.profileId });
  if (query.id) return Profile.findById(query.id);
  if (query.loginMobileNumber) return Profile.findOne({ loginMobileNumber: query.loginMobileNumber });
  return null;
};

const getProfile = async (req, res) => {
  try {
    let profile = await findProfile(req.query);
    if (!profile && req.query.loginMobileNumber) {
      profile = await Profile.create({
        profileId: await generateNextProfileId(),
        loginMobileNumber: req.query.loginMobileNumber
      });
    }
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });
    return res.json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, profileId, loginMobileNumber, ...profileData } = req.body;
    let profile = await findProfile({ id, profileId, loginMobileNumber });
    if (!profile) {
      if (!loginMobileNumber) return res.status(400).json({ success: false, message: 'Mobile number is required.' });
      profile = new Profile({ profileId: await generateNextProfileId(), loginMobileNumber, ...profileData });
    } else {
      Object.assign(profile, profileData);
    }
    await profile.save();
    return res.json({ success: true, message: 'Profile updated successfully.', data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to update profile.' });
  }
};

const getStoredProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ loginMobileNumber: req.params.loginMobileNumber });
    if (!profile) return res.status(404).json({ success: false, message: 'Stored profile not found.' });
    return res.json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch stored profile.' });
  }
};

module.exports = { getProfile, updateProfile, getStoredProfile };
