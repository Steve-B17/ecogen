import Image from "next/image";
import Video from "../public/assets/Video 2.mp4";

export default Idea = () => {
  return (
    <>
      <div>
        <video className="w-full" autoPlay loop muted>
          <source src={Video} type="video/mp4" />
        </video>
        <p className="">
          Through machine learning , we accurately predict wind and solar power
          generation, augmented by forecasts of wind and solar radiation. This
          multi-dimensional approach not only enhances accuracy but also
          empowers informed decision-making, leading to optimized industrial
          efficiency. Our comprehensive visualizations offer valuable insights,
          facilitating the seamless integration of renewable energy sources into
          the grid.
        </p>
      </div>
    </>
  );
};
