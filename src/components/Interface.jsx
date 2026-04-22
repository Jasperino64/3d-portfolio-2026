import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { animated, useSpring, useSprings } from "@react-spring/web";
import { config } from "../config";
import { atom, useAtom } from "jotai";
import { useMobile } from "../hooks/useMobile";

export const projectAtom = atom(config.projects[0]);

export const Interface = () => {
  const scrollData = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [section, setSection] = useState(0);
  const [_, setProject] = useAtom(projectAtom);
  const { isMobile } = useMobile();

  useFrame(() => {
    setHasScrolled(scrollData.offset > 0);
    const currentSection = Math.round(
      scrollData.offset * (scrollData.pages - 1),
    );
    if (section !== currentSection) {
      setSection(currentSection);
    }

    setSkillsOpacity({
      opacity: scrollData.curve(1 / 6, 1 / 3),
      immediate: true,
    });
    
    setProjectsOpacity({
      opacity: scrollData.curve(3 / 6, 1 / 3),
      immediate: true,
    });
  });

  const { opacity } = useSpring({
    opacity: hasScrolled ? 0 : 1,
  });

  const { y } = useSpring({
    from: { y: 0 },
    to: { y: 4 },
    loop: { reverse: true, delay: 500 },
    config: { duration: 1000 },
  });

  const skillsInView = section === config.sections.indexOf("skills");

  const [{ opacity: skillsOpacity }, setSkillsOpacity] = useSpring(() => ({
    opacity: 0,
  }));

  const skillsSprings = useSprings(
    config.skills.length,
    config.skills.map((skill, idx) => ({
      opacity: skillsInView ? 1 : 0,
      width: skillsInView ? `${skill.level}%` : "0%",
      delay: skillsInView ? (isMobile ? 0 : idx * 620) : 0,
      config: { duration: 1000 },
    })),
  );

  const projectsInView = section === config.sections.indexOf("projects");

  const [{ opacity: projectsOpacity }, setProjectsOpacity] = useSpring(() => ({
    opacity: 0,
  }));

  const projectsSprings = useSprings(
    config.projects.length,
    config.projects.map((project, idx) => ({
      opacity: projectsInView ? 1 : 0,
      y: projectsInView ? 0 : 20,
      delay: projectsInView ? (isMobile ? 0 : idx * 500) : 0,
      config: { duration: 1000 },
    })),
  );
  
  const contactInView = section === config.sections.indexOf("contact");

  const { opacity: contactOpacity } = useSpring({
    opacity: contactInView ? 1 : 0,
  });

  return (
    <div className="interface">
      <div className="sections">
        {/* HOME */}
        <section className="section section--bottom">
          <animated.div className="scroll-down" style={{ opacity }}>
            <animated.div
              className="scroll-down__wheel"
              style={{ translateY: y }}
            ></animated.div>
          </animated.div>
        </section>
        {/* SKILLS */}
        <section className="section section--right mobile--section--left mobile--section--bottom">
          <animated.div className="skills" style={{ opacity: skillsOpacity }}>
            {skillsSprings.map((spring, idx) => {
              const skill = config.skills[idx];
              return (
                <animated.div
                  key={skill.name}
                  className="skill"
                  style={{ opacity: spring.opacity }}
                >
                  <div className="skill__label">
                    <img
                      className="skill__label__image"
                      src={skill.icon}
                      alt={skill.name}
                    />
                    <h2 className="skill__label__name">{skill.name}</h2>
                  </div>
                  <div className="skill__level">
                    <animated.div
                      className="skill__level__bar"
                      style={{ width: spring.width }}
                    ></animated.div>
                  </div>
                </animated.div>
              );
            })}
          </animated.div>
        </section>
        {/* PROJECTS */}
        <section className="section section--left mobile--section--bottom">
          <animated.div
            className="projects"
            style={{ opacity: projectsOpacity }}
          >
            {projectsSprings.map((spring, idx) => {
              const project = config.projects[idx];
              return (
                <animated.div
                  key={project.name}
                  className="project"
                  style={{ opacity: spring.opacity, y: spring.y }}
                  onMouseEnter={() => {
                    setProject(project);
                  }}
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="project__image"
                      src={project.image}
                      alt={project.name}
                    />
                    <div className="project__details">
                      <h2 className="project__details__name">{project.name}</h2>
                      <p className="project__details__description">
                        {project.description}
                      </p>
                    </div>
                  </a>
                </animated.div>
              );
            })}
          </animated.div>
        </section>
        {/* CONTACT */}
        <section className="section section--left mobile--section--bottom">
          <animated.div
            className="contact"
            style={{ opacity: contactOpacity }}
          >
            <h1 className="contact__name">{config.contact.name}</h1>
            <p className="contact__address">{config.contact.address}</p>
            <div className="contact__socials">
              <a href={config.contact.socials.linkedin} target="_blank" rel="noopener noreferrer">
                <img
                  className="contact__socials__icon"
                  src="icons/linkedin.png"
                  alt="linkedin"
                />
              </a>
              <a href={config.contact.socials.github} target="_blank" rel="noopener noreferrer">
                <img
                  className="contact__socials__icon"
                  src="icons/github.png"
                  alt="github"
                />
              </a>
              <a href={`mailto:${config.contact.email}`} target="_blank" rel="noopener noreferrer">
                <img
                  className="contact__socials__icon"
                  src="icons/email.png"
                  alt="email"
                />
              </a>
            </div>
          </animated.div>
        </section>
      </div>
    </div>
  );
};
