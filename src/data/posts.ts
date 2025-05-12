export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
}

export const posts: BlogPost[] = [
  {
    id: "1",
    title: "The Shifting Global Order: A New Era of International Relations",
    summary: "An in-depth analysis of how recent global events are reshaping international power dynamics and what it means for the future of diplomacy.",
    content: `The international order is undergoing significant transformation. Traditional power structures are being challenged by emerging economies, technological advancement, and changing geopolitical alignments. This article explores the implications of these shifts and what they mean for global governance in the 21st century.

    Key aspects we'll examine include:
    - The rise of multilateral institutions in Asia
    - Changes in economic power distribution
    - Impact of digital diplomacy
    - Climate change as a diplomatic catalyst
    
    As we navigate these changes, it's crucial to understand how they affect international cooperation and conflict resolution mechanisms.`,
    date: "2024-06-15",
    author: "Dr. Sarah Chen",
    imageUrl: "https://source.unsplash.com/random/800x400?international"
  },
  {
    id: "2",
    title: "Climate Diplomacy: The New Frontier",
    summary: "How climate change is reshaping international cooperation and creating new diplomatic challenges and opportunities.",
    content: `Climate change has emerged as a central issue in international relations, forcing nations to reconsider their approach to diplomacy and cooperation. This piece examines how environmental challenges are creating new diplomatic frameworks and alliances.`,
    date: "2024-05-30",
    author: "James Wilson",
    imageUrl: "https://source.unsplash.com/random/800x400?climate"
  },
  {
    id: "3",
    title: "Economic Sanctions in Modern Politics",
    summary: "A comprehensive look at the effectiveness and implications of economic sanctions as a tool of international relations.",
    content: `Economic sanctions have become an increasingly popular tool in international relations. This article analyzes their effectiveness, implications, and the changing nature of economic warfare in the modern world.`,
    date: "2024-05-25",
    author: "Dr. Maria Rodriguez",
    imageUrl: "https://source.unsplash.com/random/800x400?economy"
  }
]; 