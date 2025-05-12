import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About States of Mind</h1>
      
      <section className="prose prose-lg max-w-none">
        <p className="mb-6">
        States of Mind is a space where personal perspective meets global politics. Written from the shifting ground between borders, ideologies, and human experience, this blog reflects my ongoing interest of International Relations.        </p>
        
        <p className="mb-6">
        Here, I explore the theories that shape diplomacy, the narratives that define nations, and the quiet forces, identity, perception and belief that often go unspoken in official discourse. My aim isn’t to offer definitive answers, but to ask better questions: What drives state behavior? How does power feel when lived? Where does the individual fit in a world built by systems?        </p>
        <p className="mb-6">As a citizen of a deeply interconnected world, States of Mind is my attempt to think publicly, critically, and sincerely about the issues that matter, from the structural to the subtle.</p>
        <p className="mb-6">Whether you're an IR student, a policy thinker, or someone simply curious about the world and our place in it, you're welcome here.</p>
      </section>
    </div>
  );
};

export default AboutPage; 