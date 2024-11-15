// import chatImg from "../../assets/images/netsolbg.png";
const HeroText = () => {
  return (
    <>
      <div className="herotext-wrapper text-center mt-12">
        <div className="chat-img flex justify-center">
          {/* <link rel="preload" as="image" href={chatImg} />
          <img src={chatImg} alt="chatImg" className="p-3 w-[250px]" /> */}
        </div>
        <div className="hero-text mt-6">
          <h5 className="text-2xl">Quick Simple Clear!</h5>
        </div>
        <div className="description mt-2">
          <p className="text-xs text-gray-500">
            Enter your prompt to start chatting
          </p>
        </div>
      </div>
    </>
  );
};

export default HeroText;
