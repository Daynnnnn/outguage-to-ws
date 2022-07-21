import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Head from 'next/head'
import Pusher from 'pusher-js';

export default function Home() {
  const [speed, setSpeed] = useState('...');
  const [rpm, setRpm] = useState('...');
  const [currentGear, setCurrentGear] = useState('...');
  const [turboPressure, setTurboPressure] = useState('...');
  const [oilTemprature, setOilTemprature] = useState('...');
  const [throttle, setThrottle] = useState('...');

  useEffect(() => {
    const pusher = new Pusher('app-key', {
      wsHost: '192.168.1.80',
      wsPort: '6001',
      forceTLS: false,
      encrypted: true,
      disableStats: true,
      enabledTransports: ['ws'],
    });

    const channel = pusher.subscribe('outguage-stream');

    channel.bind('payload', (data) => {
      setSpeed(Math.round(data['speed']) + " MPH");
      setRpm(Math.round(data['rpm']));
      setCurrentGear(data['gear']);
      setTurboPressure(data['turbo'] + " PSI")
      setOilTemprature(Math.round(data['oil']['temprature']) + " °C")
      setThrottle(Math.round(data.throttle * 100) + " %")
    })
  }, []);

  return (
    <div>
      <Head>
        <title>BeamNG OutGuage</title>
      </Head>

      <main className="flex w-full h-screen bg-gray-900">
        <div className='w-full align-middle m-8 grid grid-cols-1 sm:grid-cols-3 gap-8'>
          <Card title="Speed" value={speed} />
          <Card title="RPM" value={rpm} />
          <Card title="Current Gear" value={currentGear} />
          <Card title="Boost Pressure" value={turboPressure} />
          <Card title="Oil Temprature" value={oilTemprature} />
          <Card title="Throttle" value={throttle} />
        </div>
      </main>
    </div>
  )
}
