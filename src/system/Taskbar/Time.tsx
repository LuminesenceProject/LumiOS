const Time = () => {
  const getTime = () => {
    const use24hrs = false
  
    const now = new Date()
    let hours: string | number = now.getHours()
    let minutes: string | number = now.getMinutes()
    let period = 'AM'
  
    if (!use24hrs) {
      period = (hours >= 12) ? 'PM' : 'AM'
      if (hours === 0) {
        hours = 12
      } else if (hours > 12) {
        hours %= 12
      }
    }
  
    hours = (hours < 10) ? `0${hours}` : hours
    minutes = (minutes < 10) ? `0${minutes}` : minutes
  
    return (
      <>
      {
      use24hrs
      ? <>{hours}:{minutes}</>
      : <>{hours}:{minutes} {period}</>
      }
      </>
    )
  }

  return (
    <h3 className="flex flex-row justify-center items-center font-bold invert bg-primary hover:bg-primary-light duration-200 transition-colors rounded p-2 shadow-sm" style={{color: "white"}}>
      {getTime()}
    </h3>
  );
};

export default Time;