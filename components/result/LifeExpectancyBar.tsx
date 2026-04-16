'use client';

interface LifeExpectancyBarProps {
  personal_estimate: number;
  gender_average: number;
  country_average: number;
}

export default function LifeExpectancyBar({
  personal_estimate,
  gender_average,
  country_average,
}: LifeExpectancyBarProps) {
  const minAge = 55;
  const maxAge = 95;
  const range = maxAge - minAge;

  const toPercent = (age: number) =>
    Math.min(Math.max(((age - minAge) / range) * 100, 0), 100);

  const markers = [
    {
      label: 'Жеке болжам',
      age: personal_estimate,
      color: '#10B981',
      bgColor: 'bg-emerald-500',
    },
    {
      label: 'Жыныс бойынша орташа',
      age: gender_average,
      color: '#3B82F6',
      bgColor: 'bg-blue-500',
    },
    {
      label: 'ҚР бойынша орташа',
      age: country_average,
      color: '#F59E0B',
      bgColor: 'bg-yellow-500',
    },
  ];

  // Generate tick marks
  const ticks: number[] = [];
  for (let age = minAge; age <= maxAge; age += 5) {
    ticks.push(age);
  }

  return (
    <div className="bg-[#1E293B] rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-6">
        Күтілетін өмір сүру ұзақтығы
      </h3>

      <div className="relative mt-8 mb-16 mx-4">
        {/* Track */}
        <div className="h-3 bg-slate-700 rounded-full relative">
          {/* Gradient fill to personal estimate */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-40"
            style={{ width: `${toPercent(personal_estimate)}%` }}
          />
        </div>

        {/* Tick marks */}
        <div className="relative mt-1">
          {ticks.map((age) => (
            <div
              key={age}
              className="absolute flex flex-col items-center"
              style={{
                left: `${toPercent(age)}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="w-px h-2 bg-slate-600" />
              <span className="text-slate-500 text-xs mt-1">{age}</span>
            </div>
          ))}
        </div>

        {/* Markers */}
        {markers.map((marker, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{
              left: `${toPercent(marker.age)}%`,
              top: '-8px',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Pin */}
            <div
              className={`w-5 h-5 rounded-full ${marker.bgColor} border-2 border-white shadow-lg`}
            />
            {/* Label */}
            <div
              className="absolute whitespace-nowrap text-center"
              style={{ top: '32px' }}
            >
              <p className="text-xs font-medium" style={{ color: marker.color }}>
                {marker.age} жас
              </p>
              <p className="text-slate-500 text-[10px]">{marker.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
