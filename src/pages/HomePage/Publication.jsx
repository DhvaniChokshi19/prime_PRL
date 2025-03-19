import React from 'react'
import pubimg from '../../assets/pub_bg.jpg'

const Publication = () => {
  const sections = [
    {
      title: "Most Viewed",
      publications: [
        {
          title: "Highly sensitive electrochemical sensor for glutathione detection using zinc oxide quantum dots anchored on reduced graphene oxide",
          views: "8,254",
          authors: ["Vinoth V.","Subramaniyam G.","Kaimal R.","Shanmugaraj K.","Gnana Sundara Raj B.","Thirumurugan A.","Thandapani P.","Pugazhenthiran N.","Manidurai P.","Anandan S."],
          type: "Surfaces and Interfaces, Volume 51, Year 2024",
        },
        {
          title: "Design rule of swift control prototyping systems for power electronics and electrical drives",
          views: "6,130",
          authors: ["T. Bramhananda Reddy.", "N. Ravisankara Reddy.", "A. Pradeepkumar Yadav." ,"C. Harinatha Reddy.", "C. Harikrishna.","Y.V. Siva Reddy.", "Vihljajev, Vladimir", "Žilaitienė, Birutė", "Erenpreiss, Juris", "Matulevičius, Valentinas", "Laan, Mart"],
          type: "Journal of Research Administration",
        }, 
      ]
    },
    {
      title: "Most Downloaded",
      publications: [
        {
          title: "Galvijų neužkrečiamosios virškinimo organų ligos : mokomoji knyga",
          downloads: "812",
          authors: ["Antanaitis, Ramūnas"],
          type: "Mokomoji knyga / Educational book (K2b)"
        },
        {
          title: "Neurologijos pagriniai : vadovėlis",
          downloads: "280", 
          authors: ["Endzinienė, Milda", "Jurkevičienė, Giedrė", "Laurikaitė, Kristina", "Mickevičienė, Dalė", "Obelienienė, Diana", "Petrikonis, Kęstutis", "Ščiupokas, Arūnas", "Vaičienė-Magistris, Nerija", "Vaitkus, Antanas"],
          type: "Vadovėlis / Textbook (K2a)"
        },
        {
          title: "Anatomijos vardynas : [elektroninė knyga]",
          downloads: "242",
          authors: ["Stropus, Stasys Rimvydas", "Paulienė, Neringa", "Paula, Danute", "Tamošiūnas, Virgilijus", "Jakimavičienė, Eglė Marija", "Žemlevičiūtė, Palmira"],
          type: "Žodynas / Dictionary (K3a)"
        }
      ]
    },
    {
      title: "Recent Submissions",
      publications: [
        {
          title: "Paukščių aspergilioze",
          authors: ["Ročkevičius, Alius"],
          type: "Straipsnis mokslo-populiarinimo leidinyje / Article in popular science editions (S6)"
        },
        {
          title: "Smulkiųjų atrajotojų kazeoinis limfadenitas",
          authors: ["Žagrauskaitė, Rita", "Burinskaitė-Ambroziūnienė, Giedrė", "Ročkevičius, Alius"],
          type: "Straipsnis mokslo-populiarinimo leidinyje / Article in popular science editions (S6)"
        },
        {
          title: "Galvijų kraujo biocheminio tyrimo diagnostinė reikšmė",
          authors: ["Antanaitis, Ramūnas"],
          type: "Straipsnis mokslo-populiarinimo leidinyje / Article in popular science editions (S6)"
        },
        {
          title: "Arklių oro maišų mikoze",
          authors: ["Pakalniskytė, Eglė", "Mataitytė, Simona", "Graždytė, Renata"],
          type: "Straipsnis mokslo-populiarinimo leidinyje / Article in popular science editions (S6)"
        }
      ]
    }
  ];

  return (
    <div className='bg-blue-200 mx-auto max-w-6xl p-4'>
      <div className="relative w-full h-48">
        <img 
          src={pubimg} 
          alt="Dashboard" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"> 
          <div className="container mx-auto px-8 h-52 flex items-center">
            <div className="text-black space-y-6 max-w-2xl">
              <h1 className="text-5xl font-bold">
                Publications
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-gray-100 rounded shadow">
            <div className="flex justify-between items-center bg-gray-200 px-4 py-2">
              <h2 className="text-gray-700 font-medium">{section.title}</h2>
              <div className="flex">
                <button className="text-gray-500 px-1">❮</button>
                <button className="text-gray-500 px-1">❯</button>
              </div>
            </div>
            
            <div className="p-2">
              {section.publications.map((pub, pubIndex) => (
                <div key={pubIndex} className="mb-4 bg-white p-3 rounded shadow-sm">
                  <div className="flex justify-between">
                    <h3 className="text-teal-600 font-medium text-sm hover:underline cursor-pointer">
                      {pub.title}
                    </h3>
                    {pub.views && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 rounded ml-2 whitespace-nowrap">
                        {pub.views}
                      </span>
                    )}
                    {pub.downloads && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded ml-2 whitespace-nowrap">
                        {pub.downloads}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-600 text-xs mt-1 italic">
                    {pub.authors.map((author, authorIndex) => (
                      <span key={authorIndex}>
                        {author}
                        {authorIndex < pub.authors.length - 1 ? '; ' : ''}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-2">Journal</span>
                    <span className="text-xs text-gray-600">{pub.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
      </div>
    </div>
  )
}

export default Publication;