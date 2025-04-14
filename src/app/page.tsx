import Image from "next/image";
import HeroSection from "./component/HeroSection";
import IntroductionSection from "./component/IntroductionSection";
import LigandsAndTargets from "./component/LigandsAndTargets";
import IsotopesOverview from "./component/IsotopesOverview";
import Companies from "./component/Companies";
import Manufacturing from "./component/Manufacturing";
import PatientAccess from "./component/PatientAccess";

import { Perspective, ProgressNav } from "../components/ui";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <ProgressNav />
      <section id="hero">
        <HeroSection />
      </section>
      <section id="introduction">
        <IntroductionSection />
      </section>
      <section id="isotopes">
        <IsotopesOverview />
      </section>
      <section id="ligands">
        <LigandsAndTargets />
      </section>
      <section id="companies">
        <Companies />
      </section>
      <section id="manufacturing">
        <Manufacturing />
      </section>
      <section id="patient">
        <PatientAccess />
      </section>
      <section id="perspective">
        <Perspective />
      </section>

    </div>
  );
}