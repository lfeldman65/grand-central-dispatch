import AsyncStorage from '@react-native-async-storage/async-storage';

async function getItem(key: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null && value != undefined) {
      return value;
    }
  } catch (e) {
    console.log(e)
    return Promise.reject(e);
  }
};

const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    return Promise.reject(e);
  }
}

const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch(e) {
    return Promise.reject(e);
  }
}

export const storage = {
  getItem,
  setItem,
  removeItem
}