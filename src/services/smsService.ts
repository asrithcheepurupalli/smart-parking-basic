import axios from 'axios';

const API_URL = 'https://textflow-sms-api.p.rapidapi.com';
const RAPIDAPI_KEY = 'd8f410f851mshe3a0d66f97a1bf6p1f59f6jsn2852f5d52ef2';
const API_HOST = 'textflow-sms-api.p.rapidapi.com';

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 2000; // 2 seconds
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function makeRequestWithRetry(
  url: string, 
  data: any, 
  retryCount = 0
): Promise<any> {
  try {
    const response = await axios.post(
      url,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        }
      }
    );
    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retry attempt ${retryCount + 1} after ${delay}ms`);
      await sleep(delay);
      return makeRequestWithRetry(url, data, retryCount + 1);
    }
    throw error;
  }
}

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  const formattedPhone = phone.startsWith('+') 
    ? phone.replace(/\s+/g, '') 
    : `+91${phone.replace(/\s+/g, '')}`;

  const serviceAvailable = await checkService();
  if (!serviceAvailable) {
    throw new Error('SMS service is currently unavailable');
  }

  try {
    const response = await makeRequestWithRetry(
      `${API_URL}/send-sms`,
      {
        data: {
          phone_number: formattedPhone,
          text: message,
          api_key: RAPIDAPI_KEY
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('Failed to send SMS. Please try again later.');
  }
}

export async function sendVerificationCode(phone: string): Promise<boolean> {
  const formattedPhone = phone.startsWith('+') 
    ? phone.replace(/\s+/g, '') 
    : `+91${phone.replace(/\s+/g, '')}`;

  const serviceAvailable = await checkService();
  if (!serviceAvailable) {
    throw new Error('SMS verification service is currently unavailable');
  }

  try {
    const response = await makeRequestWithRetry(
      `${API_URL}/send-code`,
      {
        data: {
          phone_number: formattedPhone,
          service_name: 'ParkEasy',
          expiration_time: '600', // 10 minutes
          api_key: RAPIDAPI_KEY
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Failed to send verification code:', error);
    throw new Error('Failed to send verification code. Please try again later.');
  }
}

export async function verifyCode(phone: string, code: string): Promise<boolean> {
  const formattedPhone = phone.startsWith('+') 
    ? phone.replace(/\s+/g, '') 
    : `+91${phone.replace(/\s+/g, '')}`;

  const serviceAvailable = await checkService();
  if (!serviceAvailable) {
    throw new Error('SMS verification service is currently unavailable');
  }

  try {
    const response = await makeRequestWithRetry(
      `${API_URL}/verify-code`,
      {
        data: {
          phone_number: formattedPhone,
          code,
          api_key: RAPIDAPI_KEY
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Failed to verify code:', error);
    throw new Error('Failed to verify code. Please try again later.');
  }
}

async function checkService(): Promise<boolean> {
  try {
    const response = await makeRequestWithRetry(
      `${API_URL}/service/check`,
      {
        testing: true
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Service check failed:', error);
    return false;
  }
}