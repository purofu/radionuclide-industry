import Image from "next/image";
import HeroSection from "./component/HeroSection";
import IntroductionSection from "./component/IntroductionSection";
import LigandsAndTargets from "./component/LigandsAndTargets";
import IsotopesOverview from "./component/IsotopesOverview";
import Companies from "./component/Companies";
import PatientAccess from "./component/PatientAccess";
import { Perspective } from "../components/ui";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <IntroductionSection />
      <IsotopesOverview />
      <LigandsAndTargets />
      <Companies />
      <PatientAccess />
      <Perspective />
    </div>
  );
}