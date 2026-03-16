'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Globe, Palette, Shield, AlertTriangle, Save, Loader2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface SiteSettingsData {
    siteName: string;
    tagline: string;
    siteUrl: string;
    contactEmail: string;
    freeArticlesPerMonth: number;
    enablePaywall: boolean;
    enableComments: boolean;
    enableReactions: boolean;
    maintenanceMode: boolean;
    accentColor: string;
    pricing: {
        explorer: number;
        insider: number;
        vip: number;
    };
}

export default function SiteSettings() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [settings, setSettings] = useState<SiteSettingsData>({
        siteName: 'The Chronicle',
        tagline: 'Intelligent journalism for the modern era',
        siteUrl: 'https://thechronicle.news',
        contactEmail: 'editor@thechronicle.news',
        freeArticlesPerMonth: 5,
        enablePaywall: true,
        enableComments: true,
        enableReactions: true,
        maintenanceMode: false,
        accentColor: '#d97706',
        pricing: {
            explorer: 650,
            insider: 1500,
            vip: 3200
        }
    });

    useEffect(() => {
        if (!firestore) return;
        const loadSettings = async () => {
            try {
                const docRef = doc(firestore, 'settings', 'site');
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setSettings(prev => ({ ...prev, ...snap.data() }));
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [firestore]);

    const handleChange = (key: string, value: any) => {
        setSettings((prev: SiteSettingsData) => ({ ...prev, [key]: value }));
    };

    const handlePricingChange = (key: string, value: number) => {
        setSettings((prev: SiteSettingsData) => ({
            ...prev,
            pricing: { ...prev.pricing, [key]: value }
        }));
    };

    const handleSave = async () => {
        if (!firestore) return;
        setSaving(true);
        try {
            await setDoc(doc(firestore, 'settings', 'site'), settings);
            toast({ title: 'Settings saved to Firestore' });
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast({ variant: 'destructive', title: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
    }

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
... (lines 116-146 removed for brevity)
            </section>

            {/* Subscription Pricing */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Subscription Pricing (KES)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg border border-border">
                    <div>
                        <label className="text-xs font-bold uppercase mb-1 block">Explorer</label>
                        <input
                            type="number"
                            value={settings.pricing.explorer}
                            onChange={(e) => handlePricingChange('explorer', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase mb-1 block">Insider</label>
                        <input
                            type="number"
                            value={settings.pricing.insider}
                            onChange={(e) => handlePricingChange('insider', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase mb-1 block">VIP</label>
                        <input
                            type="number"
                            value={settings.pricing.vip}
                            onChange={(e) => handlePricingChange('vip', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                        />
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground italic">* Changes will reflect on the subscription page and Stripe checkout immediately.</p>
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
