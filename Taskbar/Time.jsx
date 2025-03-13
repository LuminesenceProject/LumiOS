const Time = () => {
  const date = new Date();

  return (
    <h3 className="flex flex-row justify-center items-center font-bold invert" style={{color: "white"}}>
      {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}
    </h3>
  );
};

export default Time;