import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import aboutImg from '../assets/images/about-img.jpg';

const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideRight = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floatY = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
`;

const About = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Wrapper ref={ref} className={visible ? 'visible' : ''}>
      <div className="bg-orb top-left" />
      <div className="bg-orb bottom-right" />

      {/* ── centred eyebrow ── */}
      <div className="section-label">
        <span className="eyebrow">Our Story</span>
      </div>

      <div className="section-center">
        {/* LEFT — image */}
        <div className="img-wrap slide-left">
          <img src={aboutImg} alt="Indian artisan crafting handmade products" />
          <div className="img-accent" />
          <div className="img-badge">
            <span className="badge-number">500+</span>
            <span className="badge-label">Artisans</span>
          </div>
        </div>

        {/* RIGHT — text */}
        <article className="slide-right">
          <div className="title">
            <h2>ABOUT US</h2>
            <div className="underline" />
          </div>

          <p>
            <strong>Handmade Haven</strong> is an E-commerce platform that seeks to
            improve the online market for small-town and rural handicrafts companies.
            By offering a shared platform for the production, marketing, and sale of
            high-quality handicrafts and products, this application seeks to promote
            the Indian handicraft industry globally.
          </p>
          <p className="secondary-text">
            India's artisan legacy is both real and intangible, and when combined
            with its regional distinctiveness, it gives the nation a competitive
            worldwide advantage. With the correct assistance and a conducive business
            environment, the Indian craft market has the potential to grow to be a
            billion-dollar industry.
          </p>

          <div className="stats-row fade-up">
            <div className="stat">
              <span className="stat-num">10K+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="divider" />
            <div className="stat">
              <span className="stat-num">50+</span>
              <span className="stat-label">Cities</span>
            </div>
            <div className="divider" />
            <div className="stat">
              <span className="stat-num">98%</span>
              <span className="stat-label">Happy Customers</span>
            </div>
          </div>
        </article>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: linear-gradient(135deg, #fefaf7 0%, #fdf3ee 60%, #fef9f6 100%);
  padding: 5rem 0 6rem;
  position: relative;
  overflow: hidden;

  /* ── orbs ── */
  .bg-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .top-left {
    width: 400px; height: 400px;
    top: -150px; left: -150px;
    background: radial-gradient(circle, rgba(184,92,56,0.08) 0%, transparent 65%);
  }
  .bottom-right {
    width: 350px; height: 350px;
    bottom: -120px; right: -120px;
    background: radial-gradient(circle, rgba(139,60,50,0.06) 0%, transparent 65%);
  }

  /* ── centred eyebrow ── */
  .section-label {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .eyebrow {
    display: inline-block;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #fff;
    background: linear-gradient(135deg, #b85c38, #c4714a);
    padding: 0.45rem 1.4rem;
    border-radius: 2rem;
    box-shadow: 0 4px 16px rgba(184,92,56,0.28);
  }

  /* ── two-column layout ── */
  .section-center {
    width: 90vw;
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    gap: 4rem;
    align-items: center;
    position: relative;
    z-index: 1;

    @media (min-width: 992px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* ── slide animations (triggered by .visible class) ── */
  .slide-left  { opacity: 0; }
  .slide-right { opacity: 0; }
  .fade-up     { opacity: 0; }

  &.visible {
    .slide-left  { animation: ${slideLeft}  0.8s ease 0.1s both; }
    .slide-right { animation: ${slideRight} 0.8s ease 0.25s both; }
    .fade-up     { animation: ${fadeUp}     0.7s ease 0.5s both; }
  }

  /* ── image ── */
  .img-wrap {
    position: relative;
    width: 100%;

    img {
      width: 95%;
      display: block;
      border-radius: 24px;
      height: 540px;
      object-fit: cover;
      box-shadow: 0 24px 60px rgba(139,60,50,0.18);
      position: relative;
      z-index: 2;
    }

    .img-accent {
      position: absolute;
      inset: -12px 12px -12px -12px;
      border: 2px solid rgba(184,92,56,0.22);
      border-radius: 28px;
      z-index: 1;
      pointer-events: none;
    }

    .img-badge {
      position: absolute;
      bottom: -18px; right: -14px;
      background: linear-gradient(135deg, #b85c38, #c4714a);
      color: #fff;
      padding: 1rem 1.4rem;
      border-radius: 16px;
      text-align: center;
      z-index: 3;
      box-shadow: 0 8px 24px rgba(184,92,56,0.35);
      animation: ${floatY} 4s ease-in-out infinite;

      .badge-number {
        display: block;
        font-size: 1.6rem;
        font-weight: 800;
        line-height: 1;
      }
      .badge-label {
        display: block;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        opacity: 0.9;
        margin-top: 0.25rem;
      }
    }
  }

  /* ── text side ── */
  article {
    .title {
      text-align: left;
      margin-bottom: 1.4rem;
      display: inline-block;
      h2 {
        font-size: clamp(2rem, 4vw, 2.6rem);
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #4a1c12;
        line-height: 1.1;
        margin-bottom: 0.5rem;
      }
    }

    .underline {
      width: 50%; height: 4px;
      background: linear-gradient(90deg, #b85c38, #e8926a);
      border-radius: 2px;
    }

    p {
      line-height: 1.9;
      margin-top: 1.2rem;
      color: #7a4030;
      font-size: 0.96rem;

      strong { color: #b85c38; font-weight: 700; }
    }

    .secondary-text { color: #9a6050; font-size: 0.91rem; }
  }

  /* ── stats ── */
  .stats-row {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 2.4rem;
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 16px;
    border: 1px solid rgba(184,92,56,0.13);
    box-shadow: 0 4px 20px rgba(139,60,50,0.07);
    overflow: hidden;
  }

  .stat {
    flex: 1;
    text-align: center;
    padding: 1.4rem 1rem;

    .stat-num {
      display: block;
      font-size: 1.65rem;
      font-weight: 900;
      color: #b85c38;
      line-height: 1;
    }
    .stat-label {
      display: block;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #9a6050;
      margin-top: 0.3rem;
    }
  }

  .divider {
    width: 1px; height: 48px;
    background: rgba(184,92,56,0.18);
    flex-shrink: 0;
  }

  @media (min-width: 1280px) {
    padding-top: 6rem;
  }

  @media (max-width: 1024px) {
    padding: 4rem 0 5rem;

    .section-center {
      gap: 2.5rem;
    }

    .img-wrap img {
      width: 100%;
      height: clamp(280px, 52vw, 460px);
    }
  }

  @media (max-width: 768px) {
    .section-label {
      margin-bottom: 1.5rem;
    }

    article .title {
      display: block;
      text-align: center;
    }

    article .underline {
      width: 100%;
    }

    .img-wrap .img-badge {
      right: 0;
      bottom: -12px;
      padding: 0.85rem 1.1rem;
    }

    .stats-row {
      flex-direction: column;
      align-items: stretch;
    }

    .divider {
      width: 100%;
      height: 1px;
    }
  }
`;

export default About;
