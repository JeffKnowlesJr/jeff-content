import Image from 'next/image'

export default function ProjectOmega() {
  return (
    <div className='project-page'>
      <h1>Project Omega</h1>
      <Image
        src='/images/projects/project-project-omega-cover.webp'
        alt='Project Omega Cover'
        width={500}
        height={500}
      />
      <p>
        Project Omega is a 1980 video game published by Adventure International
        for the TRS-80. In this game, the player manages a space colony.
      </p>
      <h2>Reception</h2>
      <p>
        Jon Mishcon reviewed Project Omega in The Space Gamer No. 42, commenting
        that &quot;A first rate game. I highly recommend it.&quot;
      </p>
      <h2>Trivia</h2>
      <p>
        Project Omega was developed by Robert Nicholas and released in 1980. It
        is known for its unique gameplay where players manage a space colony.
      </p>
    </div>
  )
}
