import { ContactShadows, Environment, useScroll } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useEffect, useRef, useState } from "react";
import { SectionTitle } from "./SectionTitle";
import { useFrame } from "@react-three/fiber";

import { Center, Float } from "@react-three/drei";
import { MacBookPro } from "./MacBookPro";
import { PalmTree } from "./PalmTree";
import { Star } from "./Star";
import * as THREE from "three";
import { config } from "../config";
import { BookCase } from "./BookCase";
import { CouchSmall } from "./CouchSmall";
import { Lamp } from "./Lamp";
import { MeshDistortMaterial } from "@react-three/drei";
import { Monitor } from "./Monitor";
import { MonitorScreen } from "./MonitorScreen";
import { Pigeon } from "./Pigeon";
import { Mailbox } from "./Mailbox";
import { Balloon } from "./Balloon";
import { ParkBench } from "./ParkBench";
import { animated, useSpring } from "@react-spring/three";
import { useMobile } from "../hooks/useMobile";
const SECTIONS_DISTANCE = 10;

export const Experience = () => {
  const { isMobile } = useMobile();
  const [section, setSection] = useState(config.sections[0]);
  const sceneContainer = useRef();
  const scrollData = useScroll();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      if (e.code === "Space") {
        e.preventDefault();
        const scrollAmount = window.innerHeight * 0.8;
        if (e.shiftKey) {
          scrollData.el.scrollBy({ top: -scrollAmount, behavior: "smooth" });
        } else {
          scrollData.el.scrollBy({ top: scrollAmount, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollData]);

  useEffect(() => {
    const handleHashChange = () => {
      const sectionIndex = config.sections.indexOf(
        window.location.hash.replace("#", ""),
      );
      if (sectionIndex !== -1) {
        scrollData.el.scrollTo(
          0,
          (sectionIndex / (config.sections.length - 1)) *
            (scrollData.el.scrollHeight - scrollData.el.clientHeight),
        );
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useFrame(() => {
    if (isMobile) {
      sceneContainer.current.position.x =
        -scrollData.offset * SECTIONS_DISTANCE * (scrollData.pages - 1);
      sceneContainer.current.position.z = 0;
    } else {
      sceneContainer.current.position.z =
        -scrollData.offset * SECTIONS_DISTANCE * (scrollData.pages - 1);
      sceneContainer.current.position.x = 0;
    }

    const currentSection = Math.round(
      scrollData.offset * (scrollData.pages - 1),
    );

    if (section !== currentSection) {
      setSection(config.sections[currentSection]);
    }
  });

  const springs = useSpring({
    homeY: section === "home" ? 0 : -5,
    skillsY: section === "skills" ? 0 : -5,
    projectsY: section === "projects" ? 0 : -5,
    contactY: section === "contact" ? 0 : -5,
  });

  return (
    <>
      <Environment preset="sunset" />
      <Avatar />

      {/* SHADOWS & FLOOR */}
      <ContactShadows opacity={0.5} scale={[30, 30]} color="#9c8e66" />
      <mesh position-y={-0.001} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#f5f3ee" />
      </mesh>

      <animated.group ref={sceneContainer}>
        {/* HOME */}
        <animated.group position-y={springs.homeY}>
          <Star position-z={0} position-y={2.2} scale={0.3} />
          <Float floatIntensity={2} speed={2}>
            <MacBookPro
              position-x={-1}
              position-y={0.5}
              position-z={0}
              scale={0.3}
              rotation-y={Math.PI / 4}
            />
          </Float>
          <PalmTree
            scale={0.018}
            rotation-y={THREE.MathUtils.degToRad(140)}
            position={[4, 0, -5]}
          />
          <Float floatIntensity={0.6}>
            <Center disableY disableZ>
              <SectionTitle
                size={0.8}
                position-y={2.0}
                position-z={-3}
                bevelEnabled
                bevelThickness={0.3}
              >
                {config.home.title}
              </SectionTitle>
            </Center>
          </Float>
          <Center disableY disableZ>
            <SectionTitle
              size={1}
              position-x={-0.5}
              position-y={0.4}
              position-z={-4.6}
              bevelEnabled
              bevelThickness={0.3}
              rotation-y={0}
            >
              {config.home.subtitle}
            </SectionTitle>
          </Center>
        </animated.group>
        {/* SKILLS */}
        <animated.group
          position-x={isMobile ? SECTIONS_DISTANCE : 0}
          position-z={isMobile ? -4 : SECTIONS_DISTANCE}
          position-y={springs.skillsY}
        >
          <group position-x={-2}>
            <SectionTitle position-z={1.5} rotation-y={Math.PI / 6}>
              SKILLS
            </SectionTitle>
            <BookCase position-z={-2} />
            <CouchSmall
              scale={0.4}
              position-z={0}
              position-x={-0.2}
              rotation-y={Math.PI / 3}
            />
            <Lamp
              position-z={0.6}
              position-x={-0.4}
              position-y={-0.8}
              rotation-y={-Math.PI}
            />
          </group>
          <mesh position-y={2} position-z={-4} position-x={2}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={1}
              speed={5}
              color="#569AFF"
            />
          </mesh>
        </animated.group>
        {/* PROJECTS */}
        <animated.group
          position-x={isMobile ? 2 * SECTIONS_DISTANCE : 0}
          position-z={isMobile ? -3 : 2 * SECTIONS_DISTANCE}
          position-y={springs.projectsY}
        >
          <group position-x={1}>
            <SectionTitle
              position-x={-0.5}
              position-z={0}
              rotation-y={-Math.PI / 6}
            >
              PROJECTS
            </SectionTitle>

            <group
              position-x={0.5}
              position-z={0}
              rotation-y={-Math.PI / 6}
              scale={0.8}
            >
              <MonitorScreen
                rotation-x={-0.18}
                position-z={-0.895}
                position-y={1.74}
              />
              <Monitor
                scale={0.02}
                position-y={1}
                rotation-y={-Math.PI / 2}
                position-z={-1}
              />
              <mesh scale-x={2} position-y={0.5} position-z={-1}>
                <boxGeometry />
                <meshStandardMaterial color="white" />
              </mesh>
            </group>
          </group>
        </animated.group>
        {/* CONTACT */}
        <animated.group
          position-x={isMobile ? 3 * SECTIONS_DISTANCE : 0}
          position-z={isMobile ? -4 : 3 * SECTIONS_DISTANCE}
          position-y={springs.contactY}
        >
          <SectionTitle position-x={-2} position-z={0.6}>
            CONTACT
          </SectionTitle>
          <group position-x={-2}>
            <ParkBench
              scale={0.5}
              position-x={-0.5}
              position-z={-2.5}
              rotation-y={-Math.PI / 4}
            />
            <group position-y={2.2} position-z={-0.5}>
              <Float floatIntensity={2} rotationIntensity={1.5}>
                <Balloon scale={1.5} position-x={-0.5} color="#71a2d9" />
              </Float>
              <Float
                floatIntensity={1.5}
                rotationIntensity={2}
                position-z={0.5}
              >
                <Balloon scale={1.3} color="#d97183" />
              </Float>
              <Float speed={2} rotationIntensity={2}>
                <Balloon scale={1.6} position-x={0.4} color="yellow" />
              </Float>
            </group>
          </group>

          <Mailbox
            scale={0.25}
            rotation-y={1.25 * Math.PI}
            position-x={1}
            position-y={0.25}
            position-z={0.5}
          />
          <Float floatIntensity={1.5} speed={3}>
            <Pigeon
              position-x={2}
              position-y={1.5}
              position-z={-0.5}
              scale={0.3}
            />
          </Float>
        </animated.group>
      </animated.group>
    </>
  );
};
