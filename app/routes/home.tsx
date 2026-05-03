import type { Route } from "./+types/home";

import Navbar from "../../components/Navbar";

import { ArrowRight, Clock } from "lucide-react";

import { Button } from "../../components/ui/button";

import { Layers } from "lucide-react";

import Upload from "../../components/upload";

import Footer from "../../components/Footer";


import { useNavigate } from "react-router";

import { createProject, getProjects } from "~/lib/puter.action"

import { useRef, useState, useEffect } from "react";

import beforeImg from "~/assets/before_img.png";
import afterImg from "~/assets/after_img.png";

import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const GUIDE_STEPS = [
  {
    id: "01",
    label: "Upload your floor plan",
    description:
      "Upload any 2D floor plan — JPG, PNG up to 10MB. Our system reads the layout and prepares it for rendering.",
  },
  {
    id: "02",
    label: "AI renders your space",
    description:
      "Roomify's AI engine transforms your flat blueprint into a photorealistic 3D visualization in seconds.",
  },
  {
    id: "03",
    label: "Compare & export",
    description:
      "Drag the slider to compare your original plan with the rendered result. Export or share with one click.",
  },
];

const BEFORE_IMAGE = beforeImg || "";
const AFTER_IMAGE  = afterImg || "";

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([])
  const isCreatingProjectRef = useRef(false);
  const uploadRef = useRef<HTMLDivElement>(null);
  const guideRef  = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible]       = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);
  const [activeStep, setActiveStep]     = useState(0);

  // Guard for SSR: Only render complex interactive components on the client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (uploadRef.current) observer.unobserve(uploadRef.current);
        }
      },
      { threshold: 0.15 }
    );
    if (uploadRef.current) observer.observe(uploadRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGuideVisible(true);
          if (guideRef.current) observer.unobserve(guideRef.current);
        }
      },
      { threshold: 0.1 }
    );
    if (guideRef.current) observer.observe(guideRef.current);
    return () => observer.disconnect();
  }, []);

  const handleUploadComplete = async (base64Image: string) => {
    if (isCreatingProjectRef.current) return false;
    isCreatingProjectRef.current = true;

    try {
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem = {
        id: newId, name,
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now()
      };

      const saved = await createProject({ item: newItem, visibility: 'private' });

      if (!saved) {
        console.error("createProject returned null — check hosting setup");
        return false;
      }

      setProjects((prev) => [saved, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name
        }
      });

      return true;
    } catch (err) {
      console.error("handleUploadComplete crashed:", err);
      return false;
    } finally {
      isCreatingProjectRef.current = false;
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const items = await getProjects();
      setProjects(items)
    }
    fetchProjects();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <main className="content">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-card">
            <div className="announce">
              <div className="dot">
                <div className="pulse"></div>
              </div>
              <p>Introducing Roomify 2.0</p>
            </div>

            <h1>Build beautiful spaces at the speed of thought with Roomify</h1>

            <p className="subtitle">
              Roomify is an AI-first design environment
              that helps you visualize, render, and ship
              architectural projects faster than ever.
            </p>

            <div className="actions">
              <a href="#upload" className="cta">
                Start Building <ArrowRight className="icon" />
              </a>
              <Button variant="outline" size="lg" className="demo">Watch Demo</Button>
            </div>
          </div>
        </section>

        {/* ── Guide Section ─────────────────────────────────────────── */}
        <section
          ref={guideRef}
          className={`guide ${guideVisible ? 'is-visible' : ''}`}
        >
          <div className="guide-inner">

            {/* Left: headline + steps */}
            <div className="guide-left">
              <div className="guide-eyebrow">How it works</div>
              <h2 className="guide-heading">
                See what we offer<br />and how it works
              </h2>
              <p className="guide-sub">
                Virtual tours, curated listings, and expert guidance —
                everything you need to explore and find with confidence.
              </p>

              <div className="guide-steps">
                {GUIDE_STEPS.map((step, i) => (
                  <button
                    key={step.id}
                    className={`guide-step ${activeStep === i ? 'is-active' : ''}`}
                    onClick={() => setActiveStep(i)}
                  >
                    <div className="step-indicator">
                      <span className="step-num">{step.id}</span>
                      <div className="step-line" />
                    </div>
                    <div className="step-body">
                      <h4>{step.label}</h4>
                      <p>{step.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: compare slider */}
            <div className="guide-right">
              <div className="guide-slider-wrap">
                <div className="slider-label slider-label--before">2D Plan</div>
                <div className="slider-label slider-label--after">3D Render</div>

                {isMounted && <ReactCompareSlider
                  defaultValue={40}
                  style={{ width: "100%", height: "100%" }}
                  itemOne={
                    <ReactCompareSliderImage
                      src={BEFORE_IMAGE}
                      alt="2D Floor Plan"
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={AFTER_IMAGE}
                      alt="3D Rendered"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        filter: "sepia(0.1) saturate(1.15) brightness(1.05)"
                      }}
                    />
                  }
                />}

                <div className="slider-drag-hint">
                  <span>← Drag to compare →</span>
                </div>
              </div>

              <div className="guide-badge">
                <span className="badge-num">{GUIDE_STEPS[activeStep].id}</span>
                <span className="badge-label">{GUIDE_STEPS[activeStep].label}</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── Upload Shell ──────────────────────────────────────────── */}
        <div
          id="upload"
          ref={uploadRef}
          className={`upload-shell ${isVisible ? 'is-visible' : ''}`}
        >
          <div className="grid-overlay" />
          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>
              <h3>Upload your floor plan</h3>
              <p>Supports JPG, PNG, formats up to 10MB</p>
            </div>
            <Upload onComplete={handleUploadComplete} />
          </div>
        </div>

        {/* ── Projects ──────────────────────────────────────────────── */}
        <section className="projects">
          <div className="section-inner">
            <div className="section-head">
              <div className="copy">
                <h2>Projects</h2>
                <p>
                  Your latest work and shared
                  community projects, all in one
                  place.
                </p>
              </div>
            </div>

            <div className="projects-grid">
              {projects.map(({ id, name, renderedImage, sourceImage, timestamp }) => (
                <div
                  className="project-card group"
                  key={id}
                  onClick={() => navigate(`/visualizer/${id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="preview">
                    <img src={renderedImage || sourceImage} alt="project preview" />
                    <div className="badge"><span>community</span></div>
                  </div>

                  <div className="card-body">
                    <div>
                      <h3>{name}</h3>
                      <div className="meta">
                        <Clock size={12} />
                        <span>{new Date(timestamp).toLocaleDateString()}</span>
                        <span>By ABDUS SALAM</span>
                      </div>
                    </div>
                    <div className="arrow">
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}