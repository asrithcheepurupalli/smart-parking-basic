import React from 'react';
import { Shield, Smartphone, Navigation2, Clock, Zap, BadgeCheck } from 'lucide-react';

const features = [
  {
    name: 'Secure Booking',
    description: 'Book your parking spot in advance with secure payment processing.',
    icon: Shield,
  },
  {
    name: 'Mobile Access',
    description: 'Use your phone as a digital key to access the parking facility.',
    icon: Smartphone,
  },
  {
    name: 'GPS Navigation',
    description: 'Get turn-by-turn directions to your reserved parking spot.',
    icon: Navigation2,
  },
  {
    name: '24/7 Availability',
    description: 'Find and book parking spots any time of the day or night.',
    icon: Clock,
  },
  {
    name: 'EV Charging',
    description: 'Dedicated spots for electric vehicles with charging stations.',
    icon: Zap,
  },
  {
    name: 'Guaranteed Spots',
    description: 'Your spot is reserved and guaranteed upon booking.',
    icon: BadgeCheck,
  },
];

export function Features() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Smart Parking</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to park smarter
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our smart parking system makes finding and reserving parking spots easier than ever before.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}