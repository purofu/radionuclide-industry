"use client";

import React from 'react';
import DonutChart from './DonutChart';
import { motion } from 'framer-motion';
import RadiopharmaceuticalsSection from './RadiopharmaceuticalsSection';
import styles from '@/theme/components'; // Import the styling system

const IntroductionSection = () => {
  return (
    <>
      <section className={styles.section.wrapper("relative min-h-screen")}>
        <div className={styles.section.container()}>
          {/* Title section with proper h5 size and column spans - now using updated styling components */}
          <motion.div
            className={styles.section.introduction()}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.section.introContent()}>
              <h5 className={styles.typography.introSubtitle()}>Introduction</h5>
              <h2 className={styles.typography.introTitle()}>
                Targeted radionuclide therapy & diagnostics represent one of the most promising frontiers in modern medicine.
              </h2>
              <p className={styles.typography.introBody()}>
                However, the strategic challenge lies in that every isotope and target selection dramatically impacts the entire delivery ecosystem - determining production requirements, supply chain complexity, and the ability to scale treatments to patients. In today's fast-moving RLT landscape, understanding these connections is essential for success.
              </p>
            </div>
          </motion.div>

          {/* 4 stats boxes section - ensure they're arranged in rows of 2 on mobile */}
          <div className={styles.grid.four("mb-12 md:mb-24")}>
            <motion.div 
              className={styles.card.stat()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h5 className={styles.typography.statTitle()}>Clinical trials</h5>
              <div className={styles.card.statValueContainer()}>
                <span className={styles.typography.displayValue()}>1060</span>
                <span className={styles.typography.displayLabel("text-grey")}>total amount of studies</span>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.card.stat()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h5 className={styles.typography.statTitle()}>Radioisotopes</h5>
              <div className={styles.card.statValueContainer()}>
                <span className={styles.typography.displayValue()}>27</span>
                <span className={styles.typography.displayLabel("text-grey")}>Types of radioisotopes</span>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.card.stat()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h5 className={styles.typography.statTitle()}>Companies</h5>
              <div className={styles.card.statValueContainer()}>
                <span className={styles.typography.displayValue()}>103</span>
                <span className={styles.typography.displayLabel("text-grey")}>Pharmaceutical & Biotech</span>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.card.stat()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h5 className={styles.typography.statTitle()}>Diseases</h5>
              <div className={styles.card.statValueContainer()}>
                <span className={styles.typography.displayValue()}>138</span>
                <span className={styles.typography.displayLabel("text-grey")}>Type of diseases</span>
              </div>
            </motion.div>
          </div>

          {/* Two columns section */}
          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Text column - specifically for the introduction section, spans 5 columns on desktop */}
            <motion.div
              className="col-span-4 sm:col-span-8 md:col-span-5 self-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h4 className="text-h4 font-helvetica-now text-black mb-6">Therapy and diagnosis</h4>
              <p className="text-body font-helvetica-now text-grey mb-6">
                Radiotherapeutics are transforming healthcare beyond their traditional role in cancer diagnosis. As these powerful tools expand into cancer treatment and new areas like neurodegenerative and cardiovascular diseases, they offer premium pricing, proven clinical results, natural competition barriers, and seamless diagnostic-treatment combinations.
              </p>
              <p className="text-body font-helvetica-now text-grey">
                The strategic challenge is that every isotope and target selection dramatically impacts the entire delivery ecosystem - determining production requirements, supply chain complexity, and the ability to scale treatments to patients. In today&apos;s fast-moving RLT landscape, understanding these connections is essential for success.
              </p>
            </motion.div>

            {/* Chart column spans 7 columns on desktop */}
            <motion.div
              className="col-span-4 sm:col-span-8 md:col-span-7 h-96 md:h-[31.25rem] lg:h-[37.5rem]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <DonutChart />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Light grey divider line */}
      <div className={styles.section.divider()}></div>

      {/* Radiopharmaceuticals Section */}
      <RadiopharmaceuticalsSection />
    </>
  );
};

export default IntroductionSection;