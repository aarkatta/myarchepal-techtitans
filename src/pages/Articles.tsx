import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Eye, ThumbsUp, MessageSquare, Bookmark, TrendingUp, Filter } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const articles = [
  {
    id: 1,
    title: "New Dating Techniques for Roman Pottery",
    excerpt: "Revolutionary carbon dating methods reveal surprising age of recently discovered ceramic fragments from Pompeii excavation sites...",
    author: "Dr. Sarah Johnson",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    category: "Research",
    readTime: "8 min read",
    publishedDate: "2 hours ago",
    views: 1250,
    likes: 89,
    comments: 12,
    image: "🏺",
    featured: true,
    tags: ["Dating Methods", "Roman", "Pottery"]
  },
  {
    id: 2,
    title: "Digital Archaeology: 3D Scanning in the Field",
    excerpt: "How modern technology is transforming archaeological documentation with photogrammetry and LiDAR scanning techniques...",
    author: "Prof. Michael Chen",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    category: "Technology",
    readTime: "12 min read",
    publishedDate: "1 day ago",
    views: 2340,
    likes: 156,
    comments: 28,
    image: "📡",
    featured: true,
    tags: ["3D Scanning", "Technology", "Documentation"]
  },
  {
    id: 3,
    title: "Preservation Techniques for Metal Artifacts",
    excerpt: "Essential guide to preventing corrosion and maintaining the integrity of iron and bronze discoveries during excavation...",
    author: "Emma Rodriguez",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    category: "Conservation",
    readTime: "6 min read",
    publishedDate: "3 days ago",
    views: 890,
    likes: 45,
    comments: 8,
    image: "⚔️",
    featured: false,
    tags: ["Conservation", "Metal", "Preservation"]
  },
  {
    id: 4,
    title: "Understanding Stratigraphy: Layer Analysis Guide",
    excerpt: "Comprehensive overview of stratigraphic principles and their application in modern archaeological excavations...",
    author: "James Wilson",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    category: "Methodology",
    readTime: "10 min read",
    publishedDate: "5 days ago",
    views: 1567,
    likes: 78,
    comments: 15,
    image: "📊",
    featured: false,
    tags: ["Stratigraphy", "Methodology", "Excavation"]
  },
  {
    id: 5,
    title: "Climate Impact on Archaeological Sites",
    excerpt: "Rising temperatures and extreme weather events pose unprecedented challenges to site preservation worldwide...",
    author: "Dr. Lisa Zhang",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    category: "Environment",
    readTime: "15 min read",
    publishedDate: "1 week ago",
    views: 3210,
    likes: 234,
    comments: 45,
    image: "🌡️",
    featured: true,
    tags: ["Climate", "Preservation", "Environment"]
  },
  {
    id: 6,
    title: "Ancient DNA Analysis: Recent Breakthroughs",
    excerpt: "New extraction methods allow researchers to recover genetic material from increasingly degraded specimens...",
    author: "Dr. Robert Kumar",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
    category: "Research",
    readTime: "11 min read",
    publishedDate: "2 weeks ago",
    views: 4520,
    likes: 312,
    comments: 67,
    image: "🧬",
    featured: false,
    tags: ["DNA", "Analysis", "Research"]
  }
];

const categories = ["All", "Research", "Technology", "Conservation", "Methodology", "Environment"];

const Articles = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <header className="bg-card p-4 border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Articles</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles, authors..."
              className="pl-10 border-border"
            />
          </div>
        </header>

        <div className="px-4 pt-4">
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-0 bg-transparent border-b rounded-none">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="All" className="mt-4 space-y-4">
              {articles.filter(article => article.featured).length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-foreground">Featured Articles</h2>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-3">
                    {articles.filter(article => article.featured).map((article) => (
                      <Card key={article.id} className="p-4 border-primary/20 bg-primary/5 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex gap-3">
                          <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">{article.image}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {article.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Featured
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={article.authorAvatar} />
                                  <AvatarFallback>{article.author[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{article.author}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{article.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Recent Articles</h2>
                {articles.map((article) => (
                  <Card key={article.id} className="p-4 border-border hover:shadow-md transition-all cursor-pointer">
                    <div className="flex gap-3 mb-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{article.image}</span>
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs mb-1">
                          {article.category}
                        </Badge>
                        <h3 className="font-semibold text-foreground line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{article.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{article.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{article.publishedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={article.authorAvatar} />
                        <AvatarFallback>{article.author[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{article.author}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{article.readTime}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            {categories.slice(1).map((category) => (
              <TabsContent key={category} value={category} className="mt-4 space-y-3">
                {articles
                  .filter(article => article.category === category)
                  .map((article) => (
                    <Card key={article.id} className="p-4 border-border hover:shadow-md transition-all cursor-pointer">
                      <div className="flex gap-3 mb-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{article.image}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{article.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{article.likes}</span>
                          </div>
                        </div>
                        <span>{article.publishedDate}</span>
                      </div>
                    </Card>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default Articles;