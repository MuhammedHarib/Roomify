import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";
import Navbar from "../../components/Navbar";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Layers } from "lucide-react";
import Upload from "../../components/upload";
import { useNavigate } from "react-router";
import { createProject, getProjects } from "~/lib/puter.action"
import { useRef, useState,useEffect } from "react";







export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([])
  const isCreatingProjectRef= useRef(false);
  const uploadRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once the animation has triggered
          if (uploadRef.current) observer.unobserve(uploadRef.current);
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the component is visible
    );

    if (uploadRef.current) observer.observe(uploadRef.current);
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
  
      console.log("1. Calling createProject...");
      const saved = await createProject({ item: newItem, visibility: 'private' });
      console.log("2. createProject returned:", saved);
  
      if (!saved) {
        console.error("createProject returned null — check hosting setup");
        return false;
      }
  
      console.log("3. Navigating to visualizer...");
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
      console.log("fetched projects:", items);
      setProjects(items)
    }
  
    fetchProjects();
  }, []);




  return (
    <div className="home">
      <Navbar />
      <main className="content">
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
              <Button variant="outline" size="lg" className="demo"> Watch Demo</Button>
            </div>
          </div>
        </section>

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
            <Upload
              onComplete={handleUploadComplete}
            />
          </div>
        </div>

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
                <div className="project-card group" key={id}  onClick={() => navigate(`/visualizer/${id}`)}  // ← add this
                style={{ cursor: "pointer" }}>
                  <div className="preview">
                    <img
                      src={renderedImage || sourceImage}
                      alt="project preview"
                    />
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
      </main>
    </div>
  )
}
