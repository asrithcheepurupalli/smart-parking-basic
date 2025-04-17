import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { Phone, X } from 'lucide-react';
import { sendSMS, sendVerificationCode, verifyCode } from '../services/smsService';
import toast from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUserPhone } = useUser();

  const handleSendOTP = async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    setIsLoading(true);
    try {
      const success = await sendVerificationCode(phone);
      
      if (success) {
        toast.success('OTP sent successfully');
        setStep('otp');
      } else {
        toast.error('Failed to send OTP. Please try again later.');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    setIsLoading(true);
    try {
      const isValid = await verifyCode(phone, otp);
      
      if (isValid) {
        const welcomeMessage = `Welcome to ParkEasy! You're now logged in and ready to book parking spots across Vizag.`;
        await sendSMS(phone, welcomeMessage);
        setUserPhone(phone);
        toast.success('Login successful!');
        onClose();
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'phone' ? (
          <>
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Login with Mobile</h2>
              <p className="text-gray-600 mt-2">
                Enter your mobile number to receive OTP
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    className="block w-full rounded-r-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter 10 digit number"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={phone.length !== 10 || isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Get OTP'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Enter OTP</h2>
              <p className="text-gray-600 mt-2">
                We've sent a code to +91 {phone}
              </p>
            </div>

            <div className="space-y-4">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="w-12 h-12 text-center border rounded-lg mx-1 text-lg focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />

              <button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Didn't receive OTP?{' '}
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}