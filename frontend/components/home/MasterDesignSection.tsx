"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function MasterDesignSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotateLeft = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotateRight = useTransform(scrollYProgress, [0, 1], [0, -45]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const theoryButtons = [
    { title: "Typography", href: "/theory/typography", img: "/theorybutton/typography.png" },
    { title: "Color Theory", href: "/theory/color", img: "/theorybutton/colortheory.png" },
    { title: "Layout & Grids", href: "/theory/layout", img: "/theorybutton/layout.png" },
    { title: "Design System", href: "/theory/design-systems", img: "/theorybutton/designsystem.png" },
    { title: "Visual Hierarchy", href: "/theory/visual-hierarchy", img: "/theorybutton/visualherarchy.png" },
    { title: "Motion", href: "/theory/motion", img: "/theorybutton/motion.png" },
    { title: "UX Laws", href: "/theory/ux-laws", img: "/theorybutton/UX Laws.png" },
    { title: "Accessibility", href: "/theory/accessibility", img: "/theorybutton/accessibility.png" },
  ];

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
        {/* Background Shapes */}
        <motion.div 
          style={{ y: yLeft, rotate: rotateLeft }}
          className="absolute -left-32 md:-left-48 top-10 w-40 md:w-64 lg:w-[320px] opacity-[0.15] pointer-events-none z-0"
        >
          <img src="/bg/asterisk.png" alt="" className="w-full h-auto" />
        </motion.div>

        <motion.div 
          style={{ y: yRight, rotate: rotateRight }}
          className="absolute -right-32 md:-right-48 bottom-10 w-40 md:w-64 lg:w-[320px] opacity-[0.15] pointer-events-none z-0"
        >
          <img src="/bg/flower.png" alt="" className="w-full h-auto" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 md:px-16 lg:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight font-clash">Everything You Need to <br className="hidden md:block"/> Master Design</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium font-clash">Structured modules designed to take you from beginner to expert.</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {theoryButtons.map((button, index) => (
              <TheoryButton 
                key={index}
                title={button.title}
                href={button.href}
                img={button.img}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      </section>
  );
}

function TheoryButton({ title, href, img, variants }: { title: string; href: string; img: string; variants: any }) {
  return (
    <motion.div variants={variants}>
      <Link 
        href={href} 
        className="group relative block w-full aspect-[240/100] hover:-translate-y-1 transition-transform duration-200"
      >
        <Image 
          src={img} 
          alt={title} 
          fill 
          className="object-contain"
        />
      </Link>
    </motion.div>
  );
}

