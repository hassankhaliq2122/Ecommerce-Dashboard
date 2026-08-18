import Setting from '../models/Setting.js';
import { resetDatabase } from '../config/db.js';

export const getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve settings', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create(req.body);
    } else {
      Object.assign(setting, req.body);
      await setting.save();
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

export const handleResetDatabase = async (req, res) => {
  try {
    await resetDatabase();
    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset database', error: error.message });
  }
};
