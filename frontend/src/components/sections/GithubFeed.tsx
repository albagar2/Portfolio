import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, Share2, GitFork, ExternalLink, Activity } from 'lucide-react';

export const GithubFeed = () => {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // En un entorno real, usaría el username de Alba
        fetch('https://api.github.com/users/albagar2/repos?sort=updated&per_page=6')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRepos(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-20 font-mono text-[10px] text-[var(--color-aqua)] animate-pulse">
            CONNECTING_TO_GITHUB_API...
        </div>
    );

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {repos.map((repo, i) => (
                <motion.a
                    href={repo.html_url}
                    target="_blank"
                    key={repo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="os-window p-8 hover:bg-foreground/[0.02] transition-all group"
                >
                    <div className="flex items-start justify-between mb-6">
                        <Github size={24} className="text-[var(--color-aqua)]/50 group-hover:text-[var(--color-aqua)] transition-colors" />
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 font-mono text-[9px] text-foreground/85">
                                <Star size={10} /> {repo.stargazers_count}
                            </span>
                            <span className="flex items-center gap-1.5 font-mono text-[9px] text-foreground/85">
                                <GitFork size={10} /> {repo.forks_count}
                            </span>
                        </div>
                    </div>
                    
                    <h4 className="text-2xl font-black text-foreground mb-3 truncate font-outfit uppercase italic tracking-tighter">
                        {repo.name.replace(/-/g, '_')}
                    </h4>
                    
                    <p className="text-[10px] font-mono text-foreground/85 line-clamp-2 uppercase tracking-widest mb-6 h-10">
                        {repo.description || 'NO_DESCRIPTION_STUB'}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                        <span className="text-[8px] font-mono font-black text-[var(--color-aqua)]/60 uppercase tracking-[0.3em]">
                            {repo.language || 'DATA'}
                        </span>
                        <ExternalLink size={12} className="text-foreground/20 group-hover:text-foreground transition-colors" />
                    </div>
                </motion.a>
            ))}
        </div>
    );
};
