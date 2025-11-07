using System.Collections.Concurrent;

namespace OrderApi.Services
{
    public interface IMessageQueue
    {
        void Enqueue(Guid orderId);
        bool TryDequeue(out Guid orderId);
    }

    public class LocalMessageQueue : IMessageQueue
    {
        private readonly ConcurrentQueue<Guid> _queue = new();

        public void Enqueue(Guid orderId) => _queue.Enqueue(orderId);

        public bool TryDequeue(out Guid orderId) => _queue.TryDequeue(out orderId);
    }
}
