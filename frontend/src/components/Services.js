import React from 'react';
import styled, { keyframes } from 'styled-components';
import { services } from '../constants/servicesConstants';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Services = () => {
  return (
    <Wrapper>
      <div className="section-center">
        <article className="header">
          <div className="header-left">
            <span className="eyebrow">Our Promise</span>
            <h3>WHY CHOOSE US?</h3>
            <div className="title-bar"></div>
          </div>
          <p className="header-desc">
            We offer a shared platform for the production, marketing, and sale
            of high-quality handicrafts products where we promote the Indian
            handicraft industry globally.
          </p>
        </article>

        <div className="services-grid">
          {services.map(({ id, icon, title, text }, index) => (
            <div key={id} className="service-card" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="icon-wrap">
                <span className="icon-circle">{icon}</span>
                <div className="icon-ring"></div>
              </div>
              <h4>{title}</h4>
              <p>{text}</p>
              <div className="card-bottom-bar"></div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: linear-gradient(160deg, #fdf6f0 0%, #f9ede4 40%, #fbeee8 100%);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -80px; left: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(139,60,50,0.07) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .section-center {
    width: 90vw;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: grid;
    gap: 2rem;
    margin-bottom: 3.5rem;
    align-items: center;
    @media (min-width: 992px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .eyebrow {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #b85c38;
    background: rgba(184,92,56,0.1);
    padding: 0.28rem 0.9rem;
    border-radius: 2rem;
    margin-bottom: 0.8rem;
  }

  h3 {
    color: #4a1c12;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 800;
    letter-spacing: 0.04em;
    line-height: 1.2;
    margin: 0 0 0.6rem;
  }

  .title-bar {
    width: 52px; height: 4px;
    background: linear-gradient(90deg, #b85c38, #e8926a);
    border-radius: 2px;
  }

  .header-desc {
    color: #7a4030;
    line-height: 1.85;
    font-size: 0.96rem;
    margin: 0;
  }

  .services-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
    @media (min-width: 576px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .service-card {
    background: rgba(255,255,255,0.72);
    margin-bottom: 10px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(184,92,56,0.12);
    border-radius: 20px;
    padding: 2.4rem 1.8rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    animation: ${fadeUp} 0.6s ease both;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.35s ease,
                border-color 0.3s ease;
    box-shadow: 0 4px 20px rgba(139,60,50,0.06);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 48px rgba(139,60,50,0.14);
      border-color: rgba(184,92,56,0.28);
      .icon-ring { transform: scale(1.25); opacity: 0.5; }
      .card-bottom-bar { width: 100%; }
    }

    h4 {
      color: #4a1c12;
      font-size: 0.9rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin: 1.2rem 0 0.7rem;
    }

    p {
      color: #7a4030;
      font-size: 0.9rem;
      line-height: 1.75;
      margin: 0;
    }
  }

  .card-bottom-bar {
    position: absolute;
    bottom: 0; left: 0;
    height: 3px; width: 0;
    background: linear-gradient(90deg, #b85c38, #e8926a);
    transition: width 0.4s ease;
  }

  .icon-wrap {
    position: relative;
    width: 5rem; height: 5rem;
    margin: 0 auto;
    display: grid;
    place-items: center;
  }

  .icon-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(184,92,56,0.22);
    transition: transform 0.4s ease, opacity 0.4s ease;
  }

  .icon-circle {
    width: 5rem; height: 5rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff5f0, #fde8de);
    color: #b85c38;
    box-shadow: 0 4px 16px rgba(184,92,56,0.16);
    position: relative;
    z-index: 1;
    svg { font-size: 2rem; }
  }

  @media (min-width: 1280px) {
    padding: 0 0 5rem;
    .section-center { transform: translateY(5rem); }
  }
`;

export default Services;