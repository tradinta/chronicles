'use client';

import React, { useState } from 'react';
import { Settings, Globe, Palette, Shield, AlertTriangle, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function SiteSettings() {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        siteName: 'The Chronicle',
        tagline: 'Intelligent journalism for the modern era',
        siteUrl: 'https://thechronicle.news',
        contactEmail: 'editor@thechronicle.news',
        freeArticlesPerMonth: 5,
        enablePaywall: true,
        enableComments: true,
        enableReactions: true,
        maintenanceMode: false,
        accentColor: '#d97706'
    });

    const handleChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate save - in production, save to Firestore 'siteConfig' doc
        await new Promise(r => setTimeout(r, 1000));
        toast({ title: 'Settings saved' });
        setSaving(false);
    };

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="w-6 h-6 text-primary" />
                    Site Settings
                </h2>
                <p className="text-muted-foreground">Configure your publication</p>
            </div>

            {/* General Settings */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Globe className="w-5 h-5" /> General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Site Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => handleChange('siteName', e.target.value)}
                            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Tagline</label>
                        <input
                            type="text"
                            value={settings.tagline}
                            onChange={(e) => handleChange('tagline', e.target.value)}
                            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Site URL</label>
                        <input
                            type="url"
                            value={settings.siteUrl}
                            onChange={(e) => handleChange('siteUrl', e.target.value)}
                            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Contact Email</label>
                        <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Appearance */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Palette className="w-5 h-5" /> Appearance
                </h3>
                <div>
                    <label className="text-sm font-medium mb-1 block">Accent Color</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={settings.accentColor}
                            onChange={(e) => handleChange('accentColor', e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground font-mono">{settings.accentColor}</span>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Features
                </h3>
                <div className="space-y-3">
                    {[
                        { key: 'enablePaywall', label: 'Enable Paywall', desc: 'Require subscription for full access' },
                        { key: 'enableComments', label: 'Enable Comments', desc: 'Allow users to comment on articles' },
                        { key: 'enableReactions', label: 'Enable Reactions', desc: 'Allow users to react to articles' },
                    ].map(item => (
                        <label key={item.key} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border cursor-pointer hover:bg-secondary">
                            <div>
                                <p className="font-medium text-sm">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={(settings as any)[item.key]}
                                onChange={(e) => handleChange(item.key, e.target.checked)}
                                className="w-5 h-5 accent-primary"
                            />
                        </label>
                    ))}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Free Articles per Month</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            value={settings.freeArticlesPerMonth}
                            onChange={(e) => handleChange('freeArticlesPerMonth', parseInt(e.target.value))}
                            className="w-24 px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4 border border-red-500/30 rounded-lg p-4 bg-red-500/5">
                <h3 className="text-lg font-bold flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <label className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/30 cursor-pointer">
                    <div>
                        <p className="font-medium text-sm text-red-600">Maintenance Mode</p>
                        <p className="text-xs text-red-600/70">Take the site offline for maintenance</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                        className="w-5 h-5 accent-red-500"
                    />
                </label>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
}
