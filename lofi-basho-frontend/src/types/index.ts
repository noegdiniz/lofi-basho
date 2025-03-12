interface Haiku {
  id: number;
  likes_count: number;
  text: string;
  tags: string[];
  date: string;
  color: string;
  owner: {
    avatar: string;
    username: string;
    id : number;
  };
}

interface HaikuInfoProps {
  haiku: Haiku;
}

interface HaikuListProps {
    initialHaikus: Haiku[];
}

interface User {
    avatar: string;
    username: string;
}