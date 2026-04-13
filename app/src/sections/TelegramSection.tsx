import { useState } from 'react';
import { 
  MessageCircle, 
  Check, 
  X,
  RefreshCw, 
  Settings, 
  Send,
  Bot,
  Webhook,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { sampleTelegramMessages } from '@/data/store';
import type { TelegramMessage } from '@/types';
import { format } from 'date-fns';

export default function TelegramSection() {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [messages] = useState<TelegramMessage[]>(sampleTelegramMessages);
  const [isAutoImport, setIsAutoImport] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.shopmanager.com/webhook');
  const [botToken, setBotToken] = useState('••••••••••••••••••••••••••');

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus('connected');
      toast.success('Connection successful!');
    }, 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Telegram Bot Integration</h1>
            <p className="text-muted-foreground">Connect your shop with Telegram for automated payment notifications</p>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <Badge className="bg-success/10 text-success px-3 py-1">
                <Check className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            ) : connectionStatus === 'testing' ? (
              <Badge className="bg-warning/10 text-[#f9a825] px-3 py-1">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Testing...
              </Badge>
            ) : (
              <Badge className="bg-destructive/10 text-destructive px-3 py-1">
                <X className="w-3 h-3 mr-1" />
                Disconnected
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Connection Status Card */}
      <Card className="mb-8 card-hover animate-fadeIn border-2 border-[#0088cc]/20" style={{ animationDelay: '100ms' }}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Telegram Icon */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0088cc] to-[#00a8e6] flex items-center justify-center shadow-xl animate-float">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center border-4 border-white">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Connection Info */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-xl font-bold text-foreground mb-2">@ShopManagerBot</h3>
              <p className="text-muted-foreground mb-4">
                Your Telegram bot is connected and receiving payment notifications from ABA Payway
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={connectionStatus === 'testing'}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${connectionStatus === 'testing' ? 'animate-spin' : ''}`} />
                  Test Connection
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button 
                  className="bg-[#0088cc] hover:bg-[#0077b3]"
                  onClick={() => window.open('https://t.me/ShopManagerBot', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Telegram
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-[#0088cc]/5">
                <p className="text-2xl font-bold text-[#0088cc]">{messages.filter(m => m.type === 'payment').length}</p>
                <p className="text-sm text-muted-foreground">Payments Today</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-success/5">
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(messages.filter(m => m.type === 'payment').reduce((sum, m) => sum + m.amount, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Total Received</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Bot Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Webhook URL */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                Webhook URL
              </Label>
              <div className="flex gap-2">
                <Input 
                  value={webhookUrl} 
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={handleCopyWebhook}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use this URL in your ABA Payway dashboard to send payment notifications
              </p>
            </div>

            {/* Bot Token */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Bot Token
              </Label>
              <Input 
                type="password" 
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your Telegram bot token from @BotFather
              </p>
            </div>

            {/* Auto Import */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-background">
              <div>
                <p className="font-medium text-foreground">Auto-import Payments</p>
                <p className="text-sm text-muted-foreground">Automatically add payments to income</p>
              </div>
              <Switch 
                checked={isAutoImport} 
                onCheckedChange={setIsAutoImport}
              />
            </div>

            {/* Last Sync */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Last synced: 2 minutes ago
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-auto">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-xl ${
                    message.type === 'payment' 
                      ? 'bg-[#e8f5e9] border-l-4 border-l-success' 
                      : 'bg-background border-l-4 border-l-primary'
                  }`}
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'payment' ? 'bg-success' : 'bg-primary'
                      }`}>
                        {message.type === 'payment' ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{message.sender}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(message.timestamp), 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    {message.amount > 0 && (
                      <span className="text-lg font-bold text-success">
                        +{formatCurrency(message.amount)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{message.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Guide */}
      <Card className="mt-6 card-hover animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-background">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h4 className="font-semibold text-foreground mb-2">Create Telegram Bot</h4>
              <p className="text-sm text-muted-foreground">
                Message @BotFather on Telegram and create a new bot. Copy the bot token.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h4 className="font-semibold text-foreground mb-2">Configure ABA Payway</h4>
              <p className="text-sm text-muted-foreground">
                In your ABA Payway dashboard, add the webhook URL to send payment notifications.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h4 className="font-semibold text-foreground mb-2">Start Receiving</h4>
              <p className="text-sm text-muted-foreground">
                Payments will automatically appear in your income when customers pay via ABA Payway.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
